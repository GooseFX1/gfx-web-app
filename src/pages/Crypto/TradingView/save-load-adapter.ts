import {
  ChartData,
  ChartMetaInfo,
  ChartTemplate,
  ChartTemplateContent,
  LineToolsAndGroupsLoadRequestContext,
  LineToolsAndGroupsLoadRequestType,
  LineToolsAndGroupsState,
  StudyTemplateData,
  StudyTemplateMetaInfo
} from '@/tv_charting_lib/charting_library'

const CHARTS_KEY = 'tradingviewCharts'
const STUDIES_KEY = 'tradingviewStudies'
const CHART_TEMPLATES_KEY = 'tradingviewChartTemplates'
const DRAWING_TEMPLATES_KEY = 'tradingviewDrawingTemplates'
/* eslint-disable-next-line */
const LINE_TOOLS_AND_GROUPS_KEY = 'tradingviewLineToolsAndGroups'

// See https://www.tradingview.com/charting-library-docs/latest/saving_loading/save-load-adapter

interface SavedChartData extends ChartData {
  timestamp: number
  id: string
}

interface SavedChartTemplate extends ChartTemplate {
  name: string
}

interface SavedDrawingTemplate {
  name: string
  toolName: string
  content: string
}

export function getAllChartTemplates(): Promise<string[]> {
  const templates: SavedChartTemplate[] = JSON.parse(localStorage.getItem(CHART_TEMPLATES_KEY)) || []
  return new Promise((resolve) => resolve(templates.map((x) => x.name)))
}
export function saveChartTemplate(name: string, content: ChartTemplateContent): Promise<void> {
  let templates: SavedChartTemplate[] = JSON.parse(localStorage.getItem(CHART_TEMPLATES_KEY)) || []
  templates = templates.filter((study) => study.name !== name)
  const newTemplate: SavedChartTemplate = { name, content }
  templates.push(newTemplate)
  localStorage.setItem(CHART_TEMPLATES_KEY, JSON.stringify(templates))
  localStorage.setItem(CHART_TEMPLATES_KEY + '.' + name, JSON.stringify(content))
  return new Promise((resolve) => resolve())
}
export function removeChartTemplate(name: string): Promise<void> {
  let templates: SavedChartTemplate[] = JSON.parse(localStorage.getItem(CHART_TEMPLATES_KEY)) || []
  templates = templates.filter((study) => study.name !== name)
  localStorage.setItem(CHART_TEMPLATES_KEY, JSON.stringify(templates))
  localStorage.removeItem(CHART_TEMPLATES_KEY + '.' + name)
  return new Promise((resolve) => resolve())
}
export function getChartTemplateContent(name: string): Promise<ChartTemplate> {
  const content: ChartTemplateContent = JSON.parse(localStorage.getItem(CHART_TEMPLATES_KEY + '.' + name))
  return new Promise((resolve) => resolve({ content }))
}

export function loadDrawingTemplate(toolName: string, templateName: string): Promise<string> {
  const content = localStorage.getItem(DRAWING_TEMPLATES_KEY + '.' + templateName + '.' + toolName)
  return new Promise((resolve) => resolve(content))
}
// TODO:
export function removeDrawingTemplate(toolName: string, templateName: string): Promise<void> {
  let templates: SavedDrawingTemplate[] = JSON.parse(localStorage.getItem(DRAWING_TEMPLATES_KEY)) || []
  templates = templates.filter((study) => study.name !== templateName && study.toolName !== toolName)
  localStorage.setItem(DRAWING_TEMPLATES_KEY, JSON.stringify(templates))
  localStorage.removeItem(DRAWING_TEMPLATES_KEY + '.' + templateName + '.' + toolName)
  return new Promise((resolve) => resolve())
}
export function getDrawingTemplates(): Promise<string[]> {
  const charts: SavedDrawingTemplate[] = JSON.parse(localStorage.getItem(DRAWING_TEMPLATES_KEY)) || []
  return new Promise((resolve) => resolve(charts.map((x) => x.name)))
}
export function saveDrawingTemplate(toolName: string, templateName: string, content: string): Promise<void> {
  let templates: SavedDrawingTemplate[] = JSON.parse(localStorage.getItem(DRAWING_TEMPLATES_KEY)) || []
  templates = templates.filter((study) => study.name !== templateName && study.toolName !== toolName)
  templates.push({
    name: templateName,
    toolName,
    content
  })
  localStorage.setItem(DRAWING_TEMPLATES_KEY, JSON.stringify(templates))
  localStorage.setItem(DRAWING_TEMPLATES_KEY + '.' + templateName + '.' + toolName, content)
  return new Promise((resolve) => resolve())
}

export function getAllCharts(): Promise<ChartMetaInfo[]> {
  const charts: SavedChartData[] = JSON.parse(localStorage.getItem(CHARTS_KEY)) || []
  const infos = charts.map((x) => x as any as ChartMetaInfo)
  return new Promise((resolve) => resolve(infos))
}

export function removeChart(chartId: string | number): Promise<void> {
  let charts: SavedChartData[] = JSON.parse(localStorage.getItem(CHARTS_KEY)) || []
  charts = charts.filter((chart) => chart.id !== chartId)
  localStorage.setItem(CHARTS_KEY, JSON.stringify(charts))
  localStorage.removeItem(CHARTS_KEY + '.' + chartId)
  return new Promise((resolve) => resolve())
}

export function saveChart(chartData: ChartData): Promise<string> {
  let { content } = chartData
  const info: SavedChartData = {
    timestamp: new Date().getTime(),
    id: chartData.id ?? 'chart' + Math.floor(Math.random() * 1e8),
    ...chartData
  }

  content = JSON.parse(content)
  content['content'] = JSON.parse(content['content'])
  // Remove "study_Overlay" i.e the indexes
  try {
    for (let i = 0; i < content['content']['charts'][0]['panes'][0]['sources'].length; i++) {
      if (content['content']['charts'][0]['panes'][0]['sources'][i]['type'] === 'study_Overlay') {
        content['content']['charts'][0]['panes'][0]['sources'].splice(i, 1)
      }
    }
  } catch (err) {
    console.error(err)
  }
  content['content'] = JSON.stringify(content['content'])
  content = JSON.stringify(content)
  let charts: SavedChartData[] = JSON.parse(localStorage.getItem(CHARTS_KEY)) || []
  charts = charts.filter((chart) => chart.id !== info.id)
  charts.push(info)
  localStorage.setItem(CHARTS_KEY, JSON.stringify(charts))
  localStorage.setItem(CHARTS_KEY + '.' + info.id, content)

  return new Promise((resolve) => resolve(info.id))
}

export function getChartContent(chartId: number): Promise<string> {
  const content = localStorage.getItem(CHARTS_KEY + '.' + chartId)
  return new Promise((resolve) => resolve(content))
}

export function getAllStudyTemplates(): Promise<StudyTemplateMetaInfo[]> {
  const templates: StudyTemplateData[] = JSON.parse(localStorage.getItem(STUDIES_KEY)) || []
  return new Promise((resolve) => resolve(templates.map((x) => ({ name: x.name }))))
}

export function removeStudyTemplate({ name }: StudyTemplateMetaInfo): Promise<void> {
  let templates: StudyTemplateData[] = JSON.parse(localStorage.getItem(STUDIES_KEY)) || []
  templates = templates.filter((study) => study.name !== name)
  localStorage.setItem(STUDIES_KEY, JSON.stringify(templates))
  localStorage.removeItem(STUDIES_KEY + '.' + name)
  return new Promise((resolve) => resolve())
}

export function saveStudyTemplate(data: StudyTemplateData): Promise<void> {
  let templates: StudyTemplateData[] = JSON.parse(localStorage.getItem(STUDIES_KEY)) || []
  templates = templates.filter((study) => study.name !== data.name)
  templates.push(data)
  localStorage.setItem(STUDIES_KEY, JSON.stringify(templates))
  localStorage.setItem(STUDIES_KEY + '.' + data.name, data.content)
  return new Promise((resolve) => resolve())
}

export function getStudyTemplateContent({ name }: StudyTemplateMetaInfo): Promise<string> {
  const content = localStorage.getItem(STUDIES_KEY + '.' + name)
  return new Promise((resolve) => resolve(content))
}

// Note: Only used if `saveload_separate_drawings_storage` featureset is enabled
/* eslint-disable @typescript-eslint/no-unused-vars */
export function loadLineToolsAndGroups(
  layoutId: string | undefined,
  chartId: string | number,
  requestType: LineToolsAndGroupsLoadRequestType,
  requestContext: LineToolsAndGroupsLoadRequestContext
): Promise<Partial<LineToolsAndGroupsState> | null> {
  return Promise.resolve(null)
}

// Note: Only used if `saveload_separate_drawings_storage` featureset is enabled
/* eslint-disable @typescript-eslint/no-unused-vars */
export function saveLineToolsAndGroups(
  layoutId: string,
  chartId: string | number,
  state: LineToolsAndGroupsState
): Promise<void> {
  return Promise.resolve()
}
