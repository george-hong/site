<template>
    <el-dialog
        title="登录"
        custom-class="login-dialog"
        destroy-on-close
        :show-close="false"
        :visible.sync="isShowLoginWindow"
        :before-close="cancelLogin"
        :close-on-click-modal="false"
        @close="resetComponent"
    >
        <el-form ref="loginForm"
                 hide-required-asterisk
                 :model="loginForm"
                 :rules="rules">
            <el-form-item prop="account">
                <el-input v-model="loginForm.account"
                          prefix-icon="el-icon-user"
                          placeholder="请输入账号"
                          clearable></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input v-model="loginForm.password"
                          show-password
                          placeholder="请输入密码"
                          prefix-icon="el-icon-lock"
                          type="password"
                          @keyup.enter.native="login"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="clearfix">
            <el-button
                class="fl"
                type="text"
                @click="goToSign"
            >
                注册账号
            </el-button>
            <el-button
                class="fr"
                type="primary"
                @click="login"
            >
                确 定
            </el-button>
            <el-button
                class="fr"
                @click="cancelLogin"
            >
                取 消
            </el-button>
        </div>
    </el-dialog>
</template>

<script>
    import request from '@request';
    import { stateNameSpace, commitNameSpace } from '@nameSpace/storeNameSpace';
    import storageNameSpace from '@nameSpace/storageNameSpace';
    import { updateLocalToken } from '../../../libs/tokenUtil';
    import { mapState } from 'vuex';

    export default {
        name: 'login',
        props: {
            visible: {
                type: Boolean,
                default: false,
            }
        },
        data() {
            return {
                loginForm: {
                    account: '',
                    password: '',
                },
                rules: {
                    account: [
                        { required: true, message: '请输入账号', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ],
                }
            }
        },
        methods: {
            async login() {
                this.isLoading = true;
                const successCallback = this[stateNameSpace.loginSuccessCallback];
                const failCallback = this[stateNameSpace.loginFailCallback];
                try {
                    await this.checkLoginForm();
                    const loginInfo = await this.requestLogin();
                    
                    // 如果有回调就执行回调，并且如果回调是Promise则在then后执行登录完成的回调
                    if (successCallback) {
                        const successCallbackResult = successCallback();
                        if (successCallbackResult && successCallbackResult.then) {
                            successCallbackResult.then(() => this.loginSuccess(loginInfo));
                        } else {
                            this.loginSuccess(loginInfo);
                        }
                    } else {
                        this.loginSuccess(loginInfo);
                    }
                } catch (err) {
                    if (failCallback) failCallback(err);
                    if (err) {
                        this.message.warning({
                            title: '登录失败',
                            message: err,
                            duration: 3000,
                        });
                    }
                }
                this.isLoading = false;
            },
            requestLogin() {
                const requestParams = this.loginForm;
                return new Promise((resolve, reject) => {
                    request.login(requestParams)
                        .then(result => {
                            const { accountInfo, token } = result;
                            // 返回账号信息表明登录成功
                            if (accountInfo) {
                                const loginInfo = {
                                    accountInfo,
                                    token,
                                };
                                resolve(loginInfo);
                            } else reject('请检查账号密码');
                        })
                        .catch(err => {
                            reject(err);
                        });
                });
            },
            loginSuccess(loginInfo) {
                const { accountInfo, token } = loginInfo;

                // 登陆成功后保存用户信息,保存token和token过期时间
                this.message.success({ title: '登录成功', message: '欢迎' });
                this.$store.commit(commitNameSpace.saveUserInfo, accountInfo);
                this.$store.commit(commitNameSpace.toggleShowLoginWindow, false);
                localStorage.setItem(storageNameSpace.userInfo, JSON.stringify(accountInfo));
                updateLocalToken(token);
            },
            goToSign() {
                const { path } = this.$route;
                if (path !== '/sign') {
                    this.$router.push('/sign');
                }
                this.$store.commit(commitNameSpace.toggleShowLoginWindow, false);
            },
            checkLoginForm() {
                return new Promise((resolve, reject) => {
                    this.$refs.loginForm.validate(isValied => {
                        if (isValied) resolve();
                        else reject();
                    });
                });
            },
            cancelLogin() {
                this.$store.commit(commitNameSpace.toggleShowLoginWindow, false);
            },
            // 重置组件信息
            resetComponent () {
                this.loginForm = {
                    account: '',
                    password: ''
                }
            }
        },
        computed: {
            ...mapState([stateNameSpace.userInfo, stateNameSpace.loginSuccessCallback, stateNameSpace.loginFailCallback]),
            isShowLoginWindow() {
                return this.$store.state[stateNameSpace.isShowLoginWindow];
            }
        }
    }
</script>

<style lang="scss">
    .login-dialog {
        width: 320px;
        .el-dialog__body {
            padding: 0 20px;
        }
    }
</style>