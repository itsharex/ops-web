<template>
  <el-form ref="form" :model="form" :rules="rules" :validate-on-rule-change="false" label-position="right" label-width="100px" style="width: 95%" size="small">
    <el-row>
      <el-col :span="10">
        <el-form-item label="账号名称" prop="name">
          <el-input v-model="form.name" autocomplete="off" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="14">
        <el-form-item label="登录方式">
          <el-input v-model="form.login_method" autocomplete="off" clearable />
          <div class="help-block" style="color: #999; font-size: 12px">描述如何登录，如：WEB浏览器、SSH客户端等</div>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="登录地址">
      <el-input v-model="form.login_address" autocomplete="off" clearable />
    </el-form-item>
    <el-row>
      <el-col :span="10">
        <el-form-item label="登录用户名">
          <el-input v-model="form.username" autocomplete="off" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="14">
        <el-form-item v-if="form.id === undefined" label="登录密码" prop="password">
          <el-input v-model="form.password" type="password" show-password autocomplete="off" clearable />
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="备注">
      <el-input v-model="form.note" type="textarea" :rows="3" autocomplete="off" clearable />
    </el-form-item>
    <el-form-item>
      <div>
        <el-button size="mini" @click="cancel">取 消</el-button>
        <el-button type="primary" size="mini" :loading="loading" @click="handleSubmit">确 定</el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'AccountAddForm',
  props: {
    form: {
      type: Object,
      default() {
        return {
          name: '',
          login_address: '',
          username: '',
          password: '',
          login_method: '',
          note: ''
        }
      }
    },
    loading: {
      type: Boolean
    }
  },
  data() {
    return {
      rules: {
        name: [
          { required: true, message: '请输入账号名称', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入账号密码', trigger: 'change' }
        ]
      }
    }
  },
  methods: {

    /* 提交表单 */
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return
        }
        this.$emit('submit', this.form)
      })
    },

    /* 关闭表单 */
    cancel() {
      this.$emit('close')
    }
  }
}
</script>
