(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["view-SignUp-vue"],{"4bd4":function(t,e,a){"use strict";var r=a("5530"),n=(a("caad"),a("2532"),a("07ac"),a("4de4"),a("d3b7"),a("159b"),a("7db0"),a("58df")),i=a("7e2b"),s=a("3206");e["a"]=Object(n["a"])(i["a"],Object(s["b"])("form")).extend({name:"v-form",provide:function(){return{form:this}},inheritAttrs:!1,props:{disabled:Boolean,lazyValidation:Boolean,readonly:Boolean,value:Boolean},data:function(){return{inputs:[],watchers:[],errorBag:{}}},watch:{errorBag:{handler:function(t){var e=Object.values(t).includes(!0);this.$emit("input",!e)},deep:!0,immediate:!0}},methods:{watchInput:function(t){var e=this,a=function(t){return t.$watch("hasError",(function(a){e.$set(e.errorBag,t._uid,a)}),{immediate:!0})},r={_uid:t._uid,valid:function(){},shouldValidate:function(){}};return this.lazyValidation?r.shouldValidate=t.$watch("shouldValidate",(function(n){n&&(e.errorBag.hasOwnProperty(t._uid)||(r.valid=a(t)))})):r.valid=a(t),r},validate:function(){return 0===this.inputs.filter((function(t){return!t.validate(!0)})).length},reset:function(){this.inputs.forEach((function(t){return t.reset()})),this.resetErrorBag()},resetErrorBag:function(){var t=this;this.lazyValidation&&setTimeout((function(){t.errorBag={}}),0)},resetValidation:function(){this.inputs.forEach((function(t){return t.resetValidation()})),this.resetErrorBag()},register:function(t){this.inputs.push(t),this.watchers.push(this.watchInput(t))},unregister:function(t){var e=this.inputs.find((function(e){return e._uid===t._uid}));if(e){var a=this.watchers.find((function(t){return t._uid===e._uid}));a&&(a.valid(),a.shouldValidate()),this.watchers=this.watchers.filter((function(t){return t._uid!==e._uid})),this.inputs=this.inputs.filter((function(t){return t._uid!==e._uid})),this.$delete(this.errorBag,e._uid)}}},render:function(t){var e=this;return t("form",{staticClass:"v-form",attrs:Object(r["a"])({novalidate:!0},this.attrs$),on:{submit:function(t){return e.$emit("submit",t)}}},this.$slots.default)}})},"5c9c":function(t,e,a){"use strict";a.r(e);var r=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-card",{staticClass:"mx-auto mt-5",attrs:{width:"400px"}},[a("v-card-title",[a("h1",{staticClass:"display-1"},[t._v("新規登録")])]),a("v-card-text",[a("v-form",[a("v-text-field",{attrs:{"prepend-icon":"mdi-account-circle",label:"ユーザ名"},model:{value:t.regData.username,callback:function(e){t.$set(t.regData,"username",e)},expression:"regData.username"}}),a("v-text-field",{attrs:{"prepend-icon":"mdi-account-multiple",label:"グループ名"},model:{value:t.regData.groupname,callback:function(e){t.$set(t.regData,"groupname",e)},expression:"regData.groupname"}}),a("v-text-field",{attrs:{"prepend-icon":"mdi-lock",label:"パスワード"},model:{value:t.regData.password,callback:function(e){t.$set(t.regData,"password",e)},expression:"regData.password"}}),a("v-card-actions",[a("v-btn",{staticClass:"info",on:{click:t.confirm}},[t._v("新規登録")])],1),a("p",{staticClass:"text-center"},[t._v(" ログインは "),a("router-link",{attrs:{to:"/login"}},[t._v("こちら")])],1)],1)],1)],1)},n=[],i={name:"SignUp",data:function(){return{showPassword:!1,name:"",password:"",loading:!1,regData:{username:"",password:"",groupname:""}}},methods:{getCurrentTime:function(){function t(t){return(t<10?"0":"")+t}var e=new Date,a=e.getFullYear()+"/"+t(e.getMonth()+1)+"/"+t(e.getDate());return a},confirm:function(){var t=this,e="http://harima-isk:50001/system/user/register",a={headers:{"Content-Type":"application/json"}},r={user_name:this.regData.username,password:this.regData.password,group_name:this.regData.groupname,level:0,created_day:this.getCurrentTime()},n={data:r};console.log(e,n,a),this.axios.post(e,n,a).then((function(e){e.status&&alert("ユーザー名:".concat(t.regData.username,"を登録しました")),console.log(e)})).catch((function(t){alert("ユーザーを登録できませんでした"),console.log(t)}))},mounted:function(){}}},s=i,o=a("2877"),c=a("6544"),u=a.n(c),d=a("8336"),l=a("b0af"),h=a("99d9"),f=a("4bd4"),p=a("8654"),g=Object(o["a"])(s,r,n,!1,null,null,null);e["default"]=g.exports;u()(g,{VBtn:d["a"],VCard:l["a"],VCardActions:h["a"],VCardText:h["b"],VCardTitle:h["c"],VForm:f["a"],VTextField:p["a"]})},"615b":function(t,e,a){},"99d9":function(t,e,a){"use strict";a.d(e,"a",(function(){return i})),a.d(e,"b",(function(){return o})),a.d(e,"c",(function(){return c}));var r=a("b0af"),n=a("80d2"),i=Object(n["j"])("v-card__actions"),s=Object(n["j"])("v-card__subtitle"),o=Object(n["j"])("v-card__text"),c=Object(n["j"])("v-card__title");r["a"]},b0af:function(t,e,a){"use strict";var r=a("5530"),n=(a("a9e3"),a("0481"),a("4069"),a("615b"),a("10d2")),i=a("297c"),s=a("1c87"),o=a("58df");e["a"]=Object(o["a"])(i["a"],s["a"],n["a"]).extend({name:"v-card",props:{flat:Boolean,hover:Boolean,img:String,link:Boolean,loaderHeight:{type:[Number,String],default:4},raised:Boolean},computed:{classes:function(){return Object(r["a"])(Object(r["a"])({"v-card":!0},s["a"].options.computed.classes.call(this)),{},{"v-card--flat":this.flat,"v-card--hover":this.hover,"v-card--link":this.isClickable,"v-card--loading":this.loading,"v-card--disabled":this.disabled,"v-card--raised":this.raised},n["a"].options.computed.classes.call(this))},styles:function(){var t=Object(r["a"])({},n["a"].options.computed.styles.call(this));return this.img&&(t.background='url("'.concat(this.img,'") center center / cover no-repeat')),t}},methods:{genProgress:function(){var t=i["a"].options.methods.genProgress.call(this);return t?this.$createElement("div",{staticClass:"v-card__progress",key:"progress"},[t]):null}},render:function(t){var e=this.generateRouteLink(),a=e.tag,r=e.data;return r.style=this.styles,this.isClickable&&(r.attrs=r.attrs||{},r.attrs.tabindex=0),t(a,this.setBackgroundColor(this.color,r),[this.genProgress(),this.$slots.default])}})}}]);
//# sourceMappingURL=view-SignUp-vue.d51794f3.js.map