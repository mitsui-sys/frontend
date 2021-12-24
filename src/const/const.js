const SAMPLE_LABELS = {
  ID: 'id',
  NAME: 'name',
  STATUS: 'status'
}

const SAMPLE_LABEL_VIEWS  = [
  { property: SAMPLE_LABELS.ID, label: 'ID', isRight: true }, // idだけ右寄せCSSclassが付与される情報を持つ
  { property: SAMPLE_LABELS.NAME, label: '名前' },
  { property: SAMPLE_LABELS.STATUS, label: 'ステータス' }
]

const SAMPLE_STATUS_VIEW = {
  active: 'アクティブ',
  stop: '停止'
}
const NAV_TITLE = "操作一覧";
const NAV_LISTS = [
{
    name: "Getting Started",
    icon: "mdi-speedometer",
    lists: [
    {
        name: "Quick Start",
        link: "/quick-start",
    },
    {
        name: "Pre-made layouts",
        link: "/pre-made-layouts",
    },
    ],
},
{
    name: "Customization",
    icon: "mdi-cogs",
},
{
    name: "Styles & animations",
    icon: "mdi-palette",
    lists: [
    { name: "Colors", link: "/colors" },
    { name: "Content", link: "/content" },
    { name: "Display", link: "/display" },
    ],
},
{
    name: "UI Components",
    icon: "mdi-view-dashboard",
    lists: [
    { name: "API explorer", link: "api_explorer" },
    { name: "Alerts", link: "alerts" },
    ],
},
{
    name: "Directives",
    icon: "mdi-function",
},
{
    name: "Preminum themes",
    icon: "mdi-vuetify",
},
]

export default Object.freeze({
    NAV_TITLE:NAV_TITLE,
    NAV_LISTS:NAV_LISTS,
    SAMPLE_LABELS:SAMPLE_LABELS,
    SAMPLE_LABEL_VIEWS:SAMPLE_LABEL_VIEWS,
    SAMPLE_STATUS_VIEW:SAMPLE_STATUS_VIEW,
    VALUE:1
});