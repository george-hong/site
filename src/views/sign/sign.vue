<template>
    <div class="w">
        <div class="form-content">
            <el-form ref="signForm"
                     label-width="80px"
                     :model="signForm"
                     :rules="rules">
                <el-form-item label="账号"
                              prop="account">
                    <el-input v-model="signForm.account"
                              placeholder="请输入账号"></el-input>
                </el-form-item>
                <el-form-item label="密码"
                              prop="password">
                    <el-input v-model="signForm.password"
                              type="password"
                              placeholder="请输入密码"
                              show-password></el-input>
                </el-form-item>
                <el-form-item label="重复密码"
                              prop="passwordRepeat">
                    <el-input v-model="signForm.passwordRepeat"
                              type="password"
                              placeholder="请再次输入密码"
                              show-password></el-input>
                </el-form-item>
                <el-form-item label="昵称"
                              prop="userName">
                    <el-input v-model="signForm.userName"
                              type="text"
                              placeholder="请输入昵称"></el-input>
                </el-form-item>
            </el-form>
            <div class="bottom-button">
                <el-button type="primary"
                           :loading="isLoading"
                           @click="sign">
                    注册
                </el-button>
            </div>
        </div>
        <el-dialog title="恭喜"
                   :visible.sync="isShowDialog"
                   :show-close="false"
                   width="300px">
            <p>注册成功</p>
            <template slot="footer">
                <el-button type="primary" @click="goToHomePage">去首页</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script>
    import { sign as signRequest, checkAccountIsRepeat } from '@request';
    export default {
        data() {
          return {
              isLoading: false,
              isShowDialog: false,
              signForm: {
                  account: '',
                  password: '',
                  passwordRepeat: '',
                  userName: '',
              },
              rules: {
                  account: [
                        { required: true, message: '请输入账号', trigger: 'blur' },
                        { min: 6, max: 20, message: '账号长度应在6-20之间', trigger: 'blur' },
                        {
                            trigger: 'blur',
                            validator: (rule, value) => {
                                return new Promise((resolve, reject) => {
                                    const params = { account: value };
                                    checkAccountIsRepeat(params)
                                        .then(result => {
                                            const { isExist } = result;
                                            if (isExist) reject('账号已存在');
                                            else resolve();
                                        })
                                        .catch(err => {
                                            reject('校验异常');
                                        });
                            });
                        }
                    },
                  ],
                  password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 8, max: 20, message: '密码长度应在8-20之间', trigger: 'blur' },
                  ],
                  passwordRepeat: [
                        { required: true, message: '请再次输入密码', trigger: 'blur' },
                        { validator: this.checkPasswordRepeat, trigger: 'blur' }
                  ],
                  userName: [
                        { min: 2, max: 10, message: '昵称长度应在2-10之间', trigger: 'blur' },
                  ],
              }
          }
        },
        methods: {
            sign() {
                this.isLoading = true;
                this.$refs.signForm.validate(isvalied => {
                    if (isvalied) this.requestSign();
                    else this.isLoading = false;
                });
            },
            requestSign() {
                console.log(this.signForm);
                signRequest(this.signForm)
                    .then(result => {
                        console.log(result);
                        this.isShowDialog = true;
                    })
                    .catch(err => {
                        console.log(err);
                    })
                    .finally(() => {
                        this.isLoading = false;
                    })
            },
            checkPasswordRepeat(rule, value, next) {
                if (value !== this.signForm.password) next(new Error('两次密码输入不一致'));
                else next();
            },
            goToHomePage() {
                this.isShowDialog = false;
                this.$router.push('/');
            }
        }
    }
</script>

<style scoped lang="scss">
    .form-content {
        padding-top: 20px;
        max-width: 320px;
        margin: 0 auto;
        .bottom-button {
            padding-left: 80px;
            button {
                width: 100%;
            }
        }
    }
</style>