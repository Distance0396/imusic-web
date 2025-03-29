<script>
export default {
  name: 'LoginIndex',
  data() {
    const checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    return {
      hidden: true,
      active: true,
      // 注册
      register: {
        name: '',
        account: '',
        password: '',
      },
      // 登陆
      landing: {
        account: '',
        password: '',
      },
      sign: {
        code: '',
        type: 'signIn',
        email: '',
      },
      rules: {
        loginIn: {
          account: [
            // { required: true, message: '账号不能为空', trigger: 'blur' },
            {
              pattern: /^[a-zA-Z0-9]{6,13}$/,
              message: '请填写6-13位账号不包含特殊字符',
              trigger: 'change',
            },
          ],
          password: [
            // { required: true, message: '密码不能为空', trigger: 'blur' }
          ],
        },
        loginUp: {
          name: [
            // { required: true, message: '昵称不能为空', trigger: 'blur' },
            {
              pattern: /^[a-zA-Z0-9]{3,15}$/,
              message: '请填写3到15位不包含特殊字符的昵称',
              trigger: 'change',
            },
          ],
          account: [
            // { required: true, message: '账号不能为空', trigger: 'blur' },
            {
              pattern: /^[a-zA-Z0-9]{6,13}$/,
              message: '请填写6-13位账号不包含特殊字符',
              trigger: 'change',
            },
          ],
          password: [
            // { required: true, message: '密码不能为空', trigger: 'blur' },
            {
              pattern: /[^[^\u4e00-\u9fa5]{6,20}$/,
              message: '请填写6到20位不包含中文字符',
              trigger: 'change',
            },
          ],
        },
        emailRules: {
          email: [
            {
              validator: checkEmail,
              trigger: 'blur',
            },
          ],
        },
      },
      registerRules: {
        name: [
          // { required: true, message: '昵称不能为空', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z0-9]{3,15}$/,
            message: '请填写3到15位不包含特殊字符的昵称',
            trigger: 'change',
          },
        ],
        account: [
          // { required: true, message: '账号不能为空', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z0-9]{6,13}$/,
            message: '请填写6-13位账号不包含特殊字符',
            trigger: 'change',
          },
        ],
        password: [
          // { required: true, message: '密码不能为空', trigger: 'blur' },
          {
            pattern: /[^[^\u4e00-\u9fa5]{6,20}$/,
            message: '请填写6到20位不包含中文字符',
            trigger: 'change',
          },
        ],
      },
      activeIndex: 'signIn',
      // 显示邮件操作
      showEmail: false,
      // 是否发送code码
      isSendCode: false,
      // 等待总时
      totalTime: 60,
      timer: null,
      codeName: '发送验证码',
      requestLoading: false,
    }
  },
  mounted() {
    const paths = document.querySelectorAll('.icon .p')
    paths.forEach(path => {
      const len = path.getTotalLength()
      path.style.setProperty('--l', len)
    })
  },
}
</script>

<template>
  <div class="login">
    <svg
      style="position: absolute"
      class="icon"
      width="100vw"
      height="100vh"
      viewBox="0 0 503 115"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        class="p"
        d="M469.026 38.88L491.17 26.08C494.071 24.3733 496.631 24.16 498.85 25.44C501.069 26.72 502.178 29.0667 502.178 32.48V45.28L491.17 51.68V38.88L469.026 51.68V100.32L491.17 87.52V74.72L502.178 68.32V81.12C502.178 83.3387 501.666 85.728 500.642 88.288C499.618 90.848 498.253 93.2373 496.546 95.456C494.925 97.5893 493.133 99.2107 491.17 100.32L469.026 113.12C466.039 114.827 463.437 115.04 461.218 113.76C458.999 112.48 457.89 110.133 457.89 106.72V58.08C457.89 55.776 458.402 53.3867 459.426 50.912C460.45 48.352 461.815 46.0053 463.522 43.872C465.229 41.6533 467.063 39.9893 469.026 38.88ZM502.178 68.32L491.17 74.72L480.034 68.32L491.17 61.92L502.178 68.32ZM491.17 74.72V87.52L480.034 81.12V68.32L491.17 74.72ZM491.17 87.52L469.026 100.32L457.89 93.92L480.034 81.12L491.17 87.52ZM491.17 38.88V51.68L480.034 45.28V32.48L491.17 38.88ZM498.85 25.44C496.631 24.16 494.071 24.3733 491.17 26.08L469.026 38.88C467.063 39.9893 465.229 41.6533 463.522 43.872C461.815 46.0053 460.45 48.352 459.426 50.912C458.402 53.3867 457.89 55.776 457.89 58.08V106.72C457.89 110.133 458.999 112.48 461.218 113.76L450.082 107.36C447.863 106.08 446.754 103.733 446.754 100.32V51.68C446.754 49.376 447.266 46.9867 448.29 44.512C449.314 41.952 450.679 39.6053 452.386 37.472C454.093 35.2533 455.927 33.5893 457.89 32.48L480.034 19.68C483.021 17.9733 485.623 17.76 487.842 19.04L498.85 25.44Z"
        fill="white"
      />
      <path
        class="p"
        d="M388.83 92V53.6L372.19 63.2V50.4L416.478 24.8V37.6L399.838 47.2V85.6L416.478 76V88.8L372.19 114.4V101.6L388.83 92ZM394.334 26.08C392.115 27.36 390.238 27.5733 388.702 26.72C387.251 25.8667 386.526 24.16 386.526 21.6C386.526 19.04 387.251 16.48 388.702 13.92C390.238 11.36 392.115 9.44 394.334 8.16C396.553 6.88 398.387 6.66666 399.838 7.52C401.374 8.37333 402.142 10.08 402.142 12.64C402.142 15.2 401.374 17.76 399.838 20.32C398.387 22.88 396.553 24.8 394.334 26.08ZM388.83 92L372.19 101.6L361.054 95.2L377.694 85.6L388.83 92ZM372.19 101.6V114.4L361.054 108V95.2L372.19 101.6ZM416.478 76L399.838 85.6L388.83 79.2L405.47 69.6L416.478 76ZM388.83 53.6V92L377.694 85.6V47.2L388.83 53.6ZM416.478 24.8L372.19 50.4L361.054 44L405.47 18.4L416.478 24.8ZM372.19 50.4V63.2L361.054 56.8V44L372.19 50.4ZM399.966 7.52C398.43 6.66666 396.553 6.88 394.334 8.16C392.115 9.44 390.238 11.36 388.702 13.92C387.251 16.48 386.526 19.04 386.526 21.6C386.526 24.16 387.294 25.8667 388.83 26.72L377.694 20.32C376.243 19.4667 375.518 17.76 375.518 15.2C375.518 12.64 376.243 10.08 377.694 7.52C379.145 4.95999 381.022 3.03999 383.326 1.75999C385.545 0.479996 387.379 0.266663 388.83 1.12L399.966 7.52Z"
        fill="white"
      />
      <path
        class="p"
        d="M297.626 82.4C294.639 84.1067 292.037 84.32 289.818 83.04C287.599 81.76 286.49 79.4133 286.49 76V63.2C286.49 60.896 287.002 58.5067 288.026 56.032C289.05 53.472 290.415 51.1253 292.122 48.992C293.829 46.7733 295.663 45.1093 297.626 44L330.778 24.8V37.6L297.626 56.8V69.6L319.77 56.8C322.671 55.0933 325.231 54.88 327.45 56.16C329.669 57.44 330.778 59.7867 330.778 63.2V76C330.778 78.2187 330.266 80.608 329.242 83.168C328.218 85.728 326.853 88.1173 325.146 90.336C323.525 92.4693 321.733 94.0907 319.77 95.2L286.49 114.4V101.6L319.77 82.4V69.6L297.626 82.4ZM319.77 69.6V82.4L308.634 76V63.2L319.77 69.6ZM319.77 82.4L286.49 101.6L275.354 95.2L308.634 76L319.77 82.4ZM286.49 101.6V114.4L275.354 108V95.2L286.49 101.6ZM327.45 56.16C325.231 54.88 322.671 55.0933 319.77 56.8L297.626 69.6L286.49 63.2L308.634 50.4C311.621 48.6933 314.223 48.48 316.442 49.76L327.45 56.16ZM330.778 24.8L297.626 44C295.663 45.1093 293.829 46.7733 292.122 48.992C290.415 51.1253 289.05 53.472 288.026 56.032C287.002 58.5067 286.49 60.896 286.49 63.2V76C286.49 79.4133 287.599 81.76 289.818 83.04L278.682 76.64C276.463 75.36 275.354 73.0133 275.354 69.6V56.8C275.354 54.496 275.866 52.1067 276.89 49.632C277.914 47.072 279.279 44.7253 280.986 42.592C282.693 40.3733 284.527 38.7093 286.49 37.6L319.77 18.4L330.778 24.8Z"
        fill="white"
      />
      <path
        class="p"
        d="M200.79 50.4L211.926 44V100.32L234.07 87.52V31.2L245.078 24.8V93.92L234.07 100.32V87.52C234.07 89.7387 233.558 92.128 232.534 94.688C231.51 97.248 230.145 99.6373 228.438 101.856C226.731 103.989 224.897 105.611 222.934 106.72L211.926 113.12C208.939 114.827 206.337 115.04 204.118 113.76C201.899 112.48 200.79 110.133 200.79 106.72V50.4ZM234.07 87.52V100.32L222.934 93.92V81.12L234.07 87.52ZM245.078 24.8L234.07 31.2L222.934 24.8L234.07 18.4L245.078 24.8ZM234.07 31.2V87.52L222.934 81.12V24.8L234.07 31.2ZM211.926 44L200.79 50.4L189.654 44L200.79 37.6L211.926 44ZM234.07 87.52L211.926 100.32L200.79 93.92L222.934 81.12L234.07 87.52ZM200.79 50.4V106.72C200.79 110.133 201.899 112.48 204.118 113.76L192.982 107.36C190.763 106.08 189.654 103.733 189.654 100.32V44L200.79 50.4Z"
        fill="white"
      />
      <path
        class="p"
        d="M97.34 45.28L108.476 38.88V51.68C108.476 49.376 108.988 46.9867 110.012 44.512C111.036 41.952 112.359 39.6053 113.98 37.472C115.687 35.2533 117.521 33.5893 119.484 32.48L122.812 30.56C125.799 28.8533 128.401 28.64 130.62 29.92C132.839 31.2 133.948 33.5467 133.948 36.96C133.948 34.656 134.46 32.2667 135.484 29.792C136.508 27.232 137.831 24.8853 139.452 22.752C141.159 20.5333 142.993 18.8693 144.956 17.76L148.284 15.84C151.271 14.1333 153.873 13.92 156.092 15.2C158.311 16.48 159.42 18.8267 159.42 22.24V78.56L148.284 84.96V28.64L133.948 36.96V93.28L122.812 99.68V43.36L108.476 51.68V108L97.34 114.4V45.28ZM148.284 28.64V84.96L137.276 78.56V22.24L148.284 28.64ZM122.812 43.36V99.68L111.676 93.28V36.96L122.812 43.36ZM156.092 15.2C153.873 13.92 151.271 14.1333 148.284 15.84L144.956 17.76C142.993 18.8693 141.159 20.5333 139.452 22.752C137.831 24.8853 136.508 27.232 135.484 29.792C134.46 32.2667 133.948 34.656 133.948 36.96L122.812 30.56C122.812 28.256 123.324 25.8667 124.348 23.392C125.372 20.832 126.737 18.4853 128.444 16.352C130.151 14.1333 131.985 12.4693 133.948 11.36L137.276 9.43999C140.177 7.73333 142.737 7.52 144.956 8.79999L156.092 15.2ZM97.34 45.28V114.4L86.204 108V38.88L97.34 45.28ZM130.62 29.92C128.401 28.64 125.799 28.8533 122.812 30.56L119.484 32.48C117.521 33.5893 115.687 35.2533 113.98 37.472C112.359 39.6053 111.036 41.952 110.012 44.512C108.988 46.9867 108.476 49.376 108.476 51.68L97.34 45.28C97.34 42.976 97.852 40.5867 98.876 38.112C99.9 35.552 101.265 33.2053 102.972 31.072C104.679 28.8533 106.513 27.1893 108.476 26.08L111.676 24.16C114.663 22.4533 117.265 22.24 119.484 23.52L130.62 29.92ZM108.476 38.88L97.34 45.28L86.204 38.88L97.34 32.48L108.476 38.88Z"
        fill="white"
      />
      <path
        class="p"
        d="M28.28 92V53.6L11.64 63.2V50.4L55.928 24.8V37.6L39.288 47.2V85.6L55.928 76V88.8L11.64 114.4V101.6L28.28 92ZM33.784 26.08C31.5653 27.36 29.688 27.5733 28.152 26.72C26.7013 25.8667 25.976 24.16 25.976 21.6C25.976 19.04 26.7013 16.48 28.152 13.92C29.688 11.36 31.5653 9.44 33.784 8.16C36.0027 6.88 37.8373 6.66666 39.288 7.52C40.824 8.37333 41.592 10.08 41.592 12.64C41.592 15.2 40.824 17.76 39.288 20.32C37.8373 22.88 36.0027 24.8 33.784 26.08ZM28.28 92L11.64 101.6L0.503998 95.2L17.144 85.6L28.28 92ZM11.64 101.6V114.4L0.503998 108V95.2L11.64 101.6ZM55.928 76L39.288 85.6L28.28 79.2L44.92 69.6L55.928 76ZM28.28 53.6V92L17.144 85.6V47.2L28.28 53.6ZM55.928 24.8L11.64 50.4L0.503998 44L44.92 18.4L55.928 24.8ZM11.64 50.4V63.2L0.503998 56.8V44L11.64 50.4ZM39.416 7.52C37.88 6.66666 36.0027 6.88 33.784 8.16C31.5653 9.44 29.688 11.36 28.152 13.92C26.7013 16.48 25.976 19.04 25.976 21.6C25.976 24.16 26.744 25.8667 28.28 26.72L17.144 20.32C15.6933 19.4667 14.968 17.76 14.968 15.2C14.968 12.64 15.6933 10.08 17.144 7.52C18.5947 4.95999 20.472 3.03999 22.776 1.75999C24.9947 0.479996 26.8293 0.266663 28.28 1.12L39.416 7.52Z"
        fill="white"
      />
    </svg>
    <!--    <div class="blur">-->
    <!--      <div class="layer1"></div>-->
    <!--      <div class="layer2"></div>-->
    <!--      <div class="layer3"></div>-->
    <!--      <div class="layer4"></div>-->
    <!--      <div class="layer5"></div>-->
    <!--    </div>-->
    <div class="login-box">
      <div class="bg-image">
        <img
          src="https://distance0.oss-cn-chengdu.aliyuncs.com/music/original-a178eaac83d810d066174bc039d61682.webp"
          alt=""
        />
      </div>
      <div class="workspace">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/scss/mixin';
body {
  height: 100%;
  background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
  overflow: hidden;
}
.login {
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  .p {
    stroke: #409eff;
    stroke-width: 1;
    stroke-dasharray: var(--l);
    stroke-dashoffset: var(--l);
    fill: none;
    stroke-linecap: round;
    animation: stroke 5s forwards;
  }
  @keyframes stroke {
    to {
      stroke-dashoffset: 0;
    }
  }
  //.blur{
  //  height: 100%;
  //  background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
  //  overflow: hidden;
  //  width: 100%;
  //  position: absolute;
  //  z-index: 2;
  //
  //  @function getShadows($n){
  //    $shadows: '#{random(100)}vw #{random(100)}vh #e1e1e1';
  //    @for $i from 2 through $n{
  //      $shadows: '#{$shadows}, #{random(100)}vw #{random(100)}vh #e1e1e1';
  //    }
  //    @return unquote($shadows)
  //  }
  //
  //  $duration: 800s;
  //  $count: 1000;
  //  @for $i from 1 through 5{
  //    $duration: floor(calc($duration / 2));
  //    $count: floor(calc($count / 2));
  //    .layer#{$i}{
  //      $size: #{$i}px;
  //      position: fixed;
  //      // color: #e1e1e1;
  //      width: $size;
  //      height: $size;
  //      border-radius: 50%;
  //      left: 0;
  //      top: 0;
  //      box-shadow: getShadows($count);
  //      animation: moveUp $duration linear infinite;
  //      &::after{
  //        content: '';
  //        position: fixed;
  //        // top: 100vh;
  //        left: -100vw;
  //        top: 0;
  //        // left: 0;
  //        width: $size;
  //        height: $size;
  //        border-radius: inherit;
  //        box-shadow: inherit;
  //      }
  //    }
  //  }
  //
  //  @keyframes moveUp {
  //    100% {
  //      transform: translateX(100vw);
  //    }
  //  }
  //}
  .login-box {
    z-index: 100;
    position: relative;
    border-radius: 8px;
    display: flex;
    overflow: hidden;
    box-shadow: var(--login-box-shadow);
    background-color: var(--aside-background-color);
    @include respond-to('phone') {
      width: 100%;
      height: 100%;
      .bg-image {
        position: absolute;
        width: 100vw;
        height: 100vh;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .workspace {
        position: relative;
        width: 100%;
        padding: 14vh 5vw 0 5vw;
        ::v-deep .signIn {
          padding: 0 30px 0 30px;
          .public {
            display: flex;
            flex-direction: column;
          }
          .el-form-item {
            .el-form-item__content {
              //margin-left: 0 !important;
              .el-input__inner {
                height: 5vh;
              }
            }
          }
          .el-button {
            margin: 20px 0 0 0;
            padding: 2vh 0;
            font-size: 14px;
          }
          .account {
          }
          .form-right {
            padding: 15px 120px 0 120px;
            @include respond-to('phone') {
              padding: 100px 30px 0 30px;
            }
            @include respond-to('tv') {
              padding: 15px 120px 0 120px;
            }
            //padding: 15px 120px 0 120px;
          }
        }
      }
    }
    @include respond-to('tv') {
      width: 60vw;
      height: 70vh;
      .bg-image {
        width: 30vw;
        height: 100vh;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .workspace {
        width: 30vw;
        ::v-deep .account-box,
        ::v-deep .email-box {
          padding: 6vh 6vw 0 6vw;
          display: flex;
          flex-direction: column;
          @include updateButton-nodeep(rgb(0, 84, 201), rgb(0, 66, 158));
          .public {
          }
          .el-form-item {
            .el-form-item__content {
              @include updateInput-nodeep();
              //margin-left: 0 !important;
              .el-input__inner {
                height: 5vh;
              }
            }
          }
          .el-divider {
            .el-divider__text {
              background-color: var(--aside-background-color);
              color: var(--text-color);
            }
          }
          .el-button {
            margin: 20px 0 0 0;
            padding: 2vh 0;
            font-size: 14px;
            width: 100%;
          }
        }
      }
    }
    .click-rolling {
      position: absolute;
      bottom: 10px;
      right: 10px;
    }
    .click-rolling:hover {
      text-decoration: underline;
    }
  }
}
</style>
