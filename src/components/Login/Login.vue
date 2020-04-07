<template>
    <el-dialog
        title="登录"
        custom-class="login-dialog"
        destroy-on-close
        :show-close="false"
        :visible.sync="isVisible"
        :before-close="cancelLogin"
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
                          type="password"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="clearfix">
            <el-button
                class="fl"
                type="text"
                @click="goToSign"
            >
                没有账号?
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

    const toggleLoginWidnowName = 'toggleShowLoginWindow';
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
                try {
                    await this.checkLoginForm();
                    const store = this.$store;
                    const callback = store.state.loginSuccessCallback;
                    await this.requestLogin();
                    callback && callback();
                    store.commit(toggleLoginWidnowName, false);
                } catch (err) {
                    if (err) {
                        this.$notify({
                            title: '登录失败',
                            message: err,
                            duration: 3000,
                            type: 'warning',
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
                            const { accountInfo } = result;
                            if (accountInfo) {
                                this.loginSuccess(accountInfo);
                                resolve();
                            } else reject('请检查账号密码');
                        })
                        .catch(err => {
                            reject(err);
                        });
                });
            },
            loginSuccess() {
                this.$notify.success({ title: '登录成功', message: '欢迎' });
                console.log('login success');
                
            },
            goToSign() {
                const { path } = this.$route;
                if (path !== '/sign') {
                    this.$router.push('/sign');
                }
                this.$store.commit(toggleLoginWidnowName, false);
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
                this.$store.commit(toggleLoginWidnowName, false)
            }
        },
        computed: {
            isVisible() {
                return this.visible;
            }
        }
    }
</script>

<style lang="scss">
    .login-dialog {
        width: 40%;
        min-width: 320px;
        max-width: 400px;
        .el-dialog__body {
            padding: 0 20px;
        }
    }
</style>