<template>
    <el-dialog
        title="登录"
        custom-class="login-dialog"
        destroy-on-close
        :show-close="false"
        :visible.sync="isVisible"
        :before-close="cancelLogin"
    >
        <el-form
            ref="loginForm"
            label-width="60px"
            hide-required-asterisk
            :model="loginForm"
            :rules="rules"
        >
            <el-form-item label="账号" prop="account">
                <el-input v-model="loginForm.account"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="loginForm.password"></el-input>
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
                try {
                    await this.checkLoginForm();
                    const store = this.$store;
                    const callback = store.state.loginSuccessCallback;
                    store.commit(toggleLoginWidnowName, false);
                    callback && callback();
                } catch (err) {
                    console.log('登录失败');
                }
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
            padding: 0 20px 0 10px;
        }
    }
</style>