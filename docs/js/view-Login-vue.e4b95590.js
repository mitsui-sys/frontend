(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["view-Login-vue"],{"4bd4":function(t,e,a){"use strict";var n=a("5530"),i=(a("caad"),a("2532"),a("07ac"),a("4de4"),a("d3b7"),a("159b"),a("7db0"),a("58df")),r=a("7e2b"),s=a("3206");e["a"]=Object(i["a"])(r["a"],Object(s["b"])("form")).extend({name:"v-form",provide:function(){return{form:this}},inheritAttrs:!1,props:{disabled:Boolean,lazyValidation:Boolean,readonly:Boolean,value:Boolean},data:function(){return{inputs:[],watchers:[],errorBag:{}}},watch:{errorBag:{handler:function(t){var e=Object.values(t).includes(!0);this.$emit("input",!e)},deep:!0,immediate:!0}},methods:{watchInput:function(t){var e=this,a=function(t){return t.$watch("hasError",(function(a){e.$set(e.errorBag,t._uid,a)}),{immediate:!0})},n={_uid:t._uid,valid:function(){},shouldValidate:function(){}};return this.lazyValidation?n.shouldValidate=t.$watch("shouldValidate",(function(i){i&&(e.errorBag.hasOwnProperty(t._uid)||(n.valid=a(t)))})):n.valid=a(t),n},validate:function(){return 0===this.inputs.filter((function(t){return!t.validate(!0)})).length},reset:function(){this.inputs.forEach((function(t){return t.reset()})),this.resetErrorBag()},resetErrorBag:function(){var t=this;this.lazyValidation&&setTimeout((function(){t.errorBag={}}),0)},resetValidation:function(){this.inputs.forEach((function(t){return t.resetValidation()})),this.resetErrorBag()},register:function(t){this.inputs.push(t),this.watchers.push(this.watchInput(t))},unregister:function(t){var e=this.inputs.find((function(e){return e._uid===t._uid}));if(e){var a=this.watchers.find((function(t){return t._uid===e._uid}));a&&(a.valid(),a.shouldValidate()),this.watchers=this.watchers.filter((function(t){return t._uid!==e._uid})),this.inputs=this.inputs.filter((function(t){return t._uid!==e._uid})),this.$delete(this.errorBag,e._uid)}}},render:function(t){var e=this;return t("form",{staticClass:"v-form",attrs:Object(n["a"])({novalidate:!0},this.attrs$),on:{submit:function(t){return e.$emit("submit",t)}}},this.$slots.default)}})},"615b":function(t,e,a){},"99d9":function(t,e,a){"use strict";a.d(e,"a",(function(){return r})),a.d(e,"b",(function(){return o})),a.d(e,"c",(function(){return c}));var n=a("b0af"),i=a("80d2"),r=Object(i["j"])("v-card__actions"),s=Object(i["j"])("v-card__subtitle"),o=Object(i["j"])("v-card__text"),c=Object(i["j"])("v-card__title");n["a"]},a55b:function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-card",{staticClass:"mx-auto mt-5",attrs:{width:"400px"}},[a("v-card-title",[a("h1",{staticClass:"display-1"},[t._v("ログイン")])]),a("v-card-text",[a("v-form",[a("v-text-field",{attrs:{"prepend-icon":"mdi-account-circle",label:"ユーザ名"},on:{keydown:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")||e.ctrlKey||e.shiftKey||e.altKey||e.metaKey?null:t.confirm.apply(null,arguments)}},model:{value:t.name,callback:function(e){t.name=e},expression:"name"}}),a("v-text-field",{attrs:{type:t.showPassword?"text":"password","prepend-icon":"mdi-lock","append-icon":t.showPassword?"mdi-eye":"mdi-eye-off",label:"パスワード"},on:{"click:append":function(e){t.showPassword=!t.showPassword},keydown:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")||e.ctrlKey||e.shiftKey||e.altKey||e.metaKey?null:t.confirm.apply(null,arguments)}},model:{value:t.password,callback:function(e){t.password=e},expression:"password"}}),a("v-card-actions",[a("v-btn",{staticClass:"info",on:{click:t.confirm}},[t._v("ログイン")])],1),a("p",{staticClass:"text-center"},[t._v(" 新規登録は "),a("router-link",{attrs:{to:"/signup"}},[t._v("こちら")])],1)],1)],1)],1)},i=[],r=(a("b0c0"),a("99af"),a("d3b7"),a("ac1f"),a("466d"),{name:"Login",data:function(){return{showPassword:!1,name:"",password:"",loading:!1}},computed:{loginData:function(){return this.$store.getters["auth/login"]}},methods:{initialize:function(){},confirm:function(){var t=this,e=this.name,a=this.password,n="http://harima-isk:50001/system/user/login?username=".concat(e,"&password=").concat(a),i={},r={headers:{"Content-Type":"application/json"}};this.loading=!0,this.axios.get(n,i,r).then((function(e){if(console.log(e),e.data.length>0){console.log("ログイン情報は存在します"),t.$store.dispatch("auth/create",e.data);var a="backuri"in t.$route.query&&t.$route.query.backuri.match(/^\//)?t.$route.query.backuri:"/";t.$router.push(a)}else alert("ユーザまたはパスワードが間違っています")})).catch((function(t){console.log(t),alert("処理が正しく行えませんでした。時間をおいてやり直してください。")})).finally((function(){t.loading=!1}))},submit:function(){console.log();var t="http://harima-isk:50001/system/user",e={data:{login_name:this.name,password:this.password}},a={headers:{"Content-Type":"application/json"}};this.axios.get(t,e,a).then((function(t){console.log(t)})).catch((function(t){console.log(t)}))},mounted:function(){this.loginData.token&&this.$router.push("/")}}}),s=r,o=a("2877"),c=a("6544"),u=a.n(c),l=a("8336"),d=a("b0af"),h=a("99d9"),f=a("4bd4"),p=a("8654"),m=Object(o["a"])(s,n,i,!1,null,null,null);e["default"]=m.exports;u()(m,{VBtn:l["a"],VCard:d["a"],VCardActions:h["a"],VCardText:h["b"],VCardTitle:h["c"],VForm:f["a"],VTextField:p["a"]})},b0af:function(t,e,a){"use strict";var n=a("5530"),i=(a("a9e3"),a("0481"),a("4069"),a("615b"),a("10d2")),r=a("297c"),s=a("1c87"),o=a("58df");e["a"]=Object(o["a"])(r["a"],s["a"],i["a"]).extend({name:"v-card",props:{flat:Boolean,hover:Boolean,img:String,link:Boolean,loaderHeight:{type:[Number,String],default:4},raised:Boolean},computed:{classes:function(){return Object(n["a"])(Object(n["a"])({"v-card":!0},s["a"].options.computed.classes.call(this)),{},{"v-card--flat":this.flat,"v-card--hover":this.hover,"v-card--link":this.isClickable,"v-card--loading":this.loading,"v-card--disabled":this.disabled,"v-card--raised":this.raised},i["a"].options.computed.classes.call(this))},styles:function(){var t=Object(n["a"])({},i["a"].options.computed.styles.call(this));return this.img&&(t.background='url("'.concat(this.img,'") center center / cover no-repeat')),t}},methods:{genProgress:function(){var t=r["a"].options.methods.genProgress.call(this);return t?this.$createElement("div",{staticClass:"v-card__progress",key:"progress"},[t]):null}},render:function(t){var e=this.generateRouteLink(),a=e.tag,n=e.data;return n.style=this.styles,this.isClickable&&(n.attrs=n.attrs||{},n.attrs.tabindex=0),t(a,this.setBackgroundColor(this.color,n),[this.genProgress(),this.$slots.default])}})}}]);
//# sourceMappingURL=view-Login-vue.e4b95590.js.map