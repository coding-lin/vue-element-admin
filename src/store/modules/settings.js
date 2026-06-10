import variables from '@/styles/element-variables.scss'
import defaultSettings from '@/settings'

const { showSettings, tagsView, fixedHeader, sidebarLogo } = defaultSettings

const SETTINGS_KEY = 'vue_element_admin_settings'

function loadSettings() {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY)
    return saved ? JSON.parse(saved) : {}
  } catch (e) {
    return {}
  }
}

function saveSettings(settings) {
  const { theme, tagsView, fixedHeader, sidebarLogo } = settings
  localStorage.setItem(SETTINGS_KEY, JSON.stringify({ theme, tagsView, fixedHeader, sidebarLogo }))
}

const saved = loadSettings()

const state = {
  theme: saved.theme || variables.theme,
  showSettings: showSettings,
  tagsView: saved.tagsView !== undefined ? saved.tagsView : tagsView,
  fixedHeader: saved.fixedHeader !== undefined ? saved.fixedHeader : fixedHeader,
  sidebarLogo: saved.sidebarLogo !== undefined ? saved.sidebarLogo : sidebarLogo
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
      saveSettings(state)
    }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

