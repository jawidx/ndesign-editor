export default class EventStore {
    static classFnName = 'EventStore'

    eventTriggerKeys = [
        { key: 'init', value: '初始化' },
        { key: 'listen', value: '监听事件' },
        { key: 'scroll', value: '滚动' },
        { key: 'mouse', value: '鼠标' }
    ]

    eventActionKeys = [
        { key: 'none', value: '无' },
        { key: 'settingGbData', value: '更改（全局、组件）数据源' },
        { key: 'dataSource', value: '触发接口数据源' },
        { key: 'emit', value: '触发事件' },
        { key: 'timer', value: '定时器' },
        { key: 'native', value: '端能力' },
        { key: 'track', value: '统计' },
        { key: 'jumpUrl', value: '跳转网址' },
        { key: 'setDocTitle', value: '设置标题' }
        // { key: 'updateProps', value: '修改属性' },
        // {key: 'call',           value: '命令（端功能）'}
    ]
}