;(window.webpackJsonp = window.webpackJsonp || []).push([
  ['editobjectdialog'],
  {
    KFNk: function (t, e, i) {},
    Kqsj: function (t, e, i) {
      'use strict'
      ;(function (t) {
        i('jgM0'), i('KFNk'), i('pay7'), i('ohga')
        var a = i('Ss5c').LineDataSource,
          o = i('GVHu').Study,
          r = i('qJq3').Series,
          n = i('fgLi').DataSource,
          s = i('FQhm'),
          l = i('bR4N').bindPopupMenu,
          p = i('QloM'),
          c = i('GAqT').TVOldDialogs,
          d = i('PC8g').trackEvent,
          u = i('CW80').isLineTool
        function h(t, e, i) {
          ;(this._source = t), (this._model = e), (this._undoCheckpoint = i)
        }
        i('PVgW'),
          (h.prototype.hide = function (t) {
            c.destroy(this._dialogTitle, { undoChanges: !!t })
          }),
          (h.prototype._onDestroy = function (t, e) {
            var i = (e || {}).undoChanges
            if (($(window).unbind('keyup.hidePropertyDialog'), i)) {
              var a = this._undoCheckpoint ? this._undoCheckpoint : this._undoCheckpointOnShow
              a && this._model.undoToCheckpoint(a)
            } else if (this._source.hasAlert && this._source.hasAlert.value()) {
              var o = this._source
              setTimeout(function () {
                o.localAndServerAlertsMismatch && o.synchronizeAlert(!0)
              })
            }
            this._undoCheckpointOnShow && delete this._undoCheckpointOnShow,
              window.lineToolPropertiesToolbar && window.lineToolPropertiesToolbar.refresh()
          }),
          (h.prototype.isVisible = function () {
            return this._dialog && this._dialog.is(':visible')
          }),
          (h.prototype.focusOnText = function () {
            this._dialog.find('input[type="text"]').focus().select()
          }),
          (h.prototype.switchTab = function (t, e) {
            if (this._tabs) {
              var i = null
              if (
                (t ? (t = t.valueOf()) : null === t && (t = void 0),
                'string' == typeof t &&
                  $.each(this._tabs, function (e, a) {
                    if (a.name === t) return (i = a), !1
                  }),
                'object' == typeof t &&
                  $.each(this._tabs, function (e, a) {
                    if (t === a || $(a.labelObject).is(t) || $(a.wrapperObject).is(t)) return (i = a), !1
                  }),
                i || (i = this._tabs[~~t]),
                !i)
              )
                return !1
              if (
                ($.each(this._tabs, function (t, e) {
                  var a = e === i
                  $(e.wrapperObject)[a ? 'show' : 'hide'](), $(e.labelObject)[a ? 'addClass' : 'removeClass']('active')
                }),
                e)
              ) {
                var a = this.activeTabSettingsName()
                a && TVSettings.setValue(a, i.name)
              }
              return (
                this._dialog.height() + 100 > $(window).height() && !i.isScrollable && this.makeScrollable(i),
                $(':focus').blur(),
                !0
              )
            }
          }),
          (h.prototype.makeScrollable = function (t) {
            var e = t.wrapperObject,
              i = $(t.objects[0]),
              a = i.width()
            e.css({ height: $(window).height() / 1.4, overflow: 'auto' }), i.css('width', a + 20), (t.isScrollable = !0)
          }),
          (h.prototype.appendToTab = function (t, e, i, a, o, r) {
            if (!$(t).is('table') || $(t).find('tr').size()) {
              var n
              this._tabs || (this._tabs = []),
                $.each(this._tabs, function (t, i) {
                  if (i.name === e) return (n = t), !1
                }),
                void 0 === n &&
                  (this._tabs.push({
                    name: e,
                    localizedName: $.t(e),
                    objects: $(),
                    displayPriority: 0,
                    defaultOpen: 0,
                    isButton: !!o,
                    callback: o ? r || function () {} : null
                  }),
                  (n = this._tabs.length - 1))
              var s = this._tabs[n]
              ;(s.objects = s.objects.add(t)),
                (s.displayPriority = Math.max(s.displayPriority || 0, i || 0)),
                (s.defaultOpen = Math.max(s.defaultOpen || 0, a || 0))
            }
          }),
          (h.prototype.insertTabs = function () {
            if (this._tabs) {
              this._tabs.sort(function (t, e) {
                return (e.displayPriority || 0) - (t.displayPriority || 0)
              })
              var t = this,
                e = null,
                i = this.activeTabSettingsName()
              if (i) var a = TVSettings.getValue(i)
              $.each(this._tabs, function (e, i) {
                var a
                i.isButton
                  ? (((a = i).labelObject = $('<a href="#" class="properties-tabs-label tv-tabs__tab"></a>')
                      .text(a.localizedName)
                      .appendTo(t._tabContainer)),
                    a.labelObject.bind('click', a.callback))
                  : o(i)
              }),
                this.switchTab(e)
            }
            function o(i) {
              a &&
                a.toLowerCase() === i.name.toLowerCase() &&
                (i.defaultOpen = Math.max(~~i.defaultOpen, p.TabOpenFrom.UserSave)),
                (!e || ~~e.defaultOpen < ~~i.defaultOpen) && (e = i),
                (i.labelObject = $('<a href="#" class="properties-tabs-label tv-tabs__tab"></a>')
                  .text(i.localizedName)
                  .appendTo(t._tabContainer)),
                i.labelObject.on('mousedown', function (e) {
                  var i = e.pageX,
                    a = e.pageY,
                    o = !1,
                    r = this
                  function n(t) {
                    var e
                    o = o || ((e = t), Math.abs(i - e.pageX) > 5 || Math.abs(a - e.pageY) > 5)
                  }
                  $(r).on('mousemove', n),
                    $(r).one('mouseup', function () {
                      o || t.switchTab(r, !0), $(r).off('mousemove', n)
                    })
                })
              var o = $('<div class="main-properties"></div>')
              ;(i.wrapperObject = $().add(o)),
                i.objects.each(function (t, e) {
                  var a = $(e)
                  a.is('table')
                    ? (a.data('layout-separated') &&
                        ((i.wrapperObject = i.wrapperObject
                          .add('<div class="properties-separator"></div>')
                          .add((o = $('<div class="main-properties"></div>')))),
                        a.removeData('layout-separated')),
                      o.append(a),
                      a.children('tbody').each(function (t, a) {
                        if (0 !== t && $(a).data('layout-separated')) {
                          i.wrapperObject = i.wrapperObject
                            .add('<div class="properties-separator"></div>')
                            .add((o = $('<div class="main-properties"></div>')))
                          var r = $(e).clone(!0, !1).appendTo(o)
                          r.children().remove(), r.append(a), $(a).removeData('layout-separated')
                        }
                      }))
                    : o.append(a)
                }),
                i.wrapperObject.appendTo(t._container)
            }
          }),
          (h.prototype.activeTabSettingsName = function () {
            var t = this._source
            if (t)
              return t instanceof r
                ? 'properties_dialog.active_tab.chart'
                : t instanceof a
                ? 'properties_dialog.active_tab.drawing'
                : t instanceof o
                ? 'properties_dialog.active_tab.study'
                : void 0
          }),
          (h.prototype.show = function (e) {
            if (t.enabled('property_pages')) {
              var h = i('kSsA'),
                b = (e = e || {}).onWidget || !1,
                f = null
              if (
                (TradingView.isInherited(this._source.constructor, r) &&
                  ((f = 'series-properties-dialog'), d('GUI', 'Series Properties')),
                TradingView.isInherited(this._source.constructor, o))
              ) {
                f = 'indicator-properties-dialog'
                var _ =
                  !this._source.isPine() || this._source.isStandardPine()
                    ? this._source.metaInfo().description
                    : 'Custom Pine'
                d('GUI', 'Study Properties', _)
              }
              if (
                (u(this._source) &&
                  ((f = 'drawing-properties-dialog'), d('GUI', 'Drawing Properties', this._source.name())),
                TradingView.isInherited(this._source.constructor, n))
              ) {
                var v = this
                this._model.selectionMacro(function (t) {
                  t.addSourceToSelection(v._source)
                })
              }
              var y = h.createStudyStrategyPropertyPage(this._source, this._model),
                g = h.createInputsPropertyPage(this._source, this._model),
                m = h.createStylesPropertyPage(this._source, this._model),
                T = h.createVisibilitiesPropertyPage(this._source, this._model),
                w = h.createDisplayPropertyPage(this._source, this._model)
              if ((g && !g.widget().is(':empty')) || m || y) {
                v = this
                var P,
                  C,
                  S = null !== g,
                  O = this._source.title(),
                  k = e.ownerDocument || this._model._chartWidget.widget().prop('ownerDocument'),
                  D = c
                    .createDialog(O, {
                      hideTitle: !0,
                      dragHandle: '.properties-tabs',
                      ownerDocument: k
                    })
                    .attr('data-dialog-type', f),
                  x = D.find('._tv-dialog-content'),
                  j = $('<div class="properties-tabs tv-tabs"></div>').appendTo(x)
                if (
                  ((this._tabs = []),
                  (this._dialog = D),
                  (this._dialogTitle = O),
                  (this._container = x),
                  (this._tabContainer = j),
                  (this._undoCheckpointOnShow = this._model.createUndoCheckpoint()),
                  D.on('destroy', function (t, e) {
                    e = e || {}
                    g && g.destroy(),
                      y && y.destroy(),
                      m && m.destroy(),
                      w && w.destroy(),
                      T && T.destroy(),
                      $('select', x).each(function () {
                        $(this).selectbox('detach')
                      }),
                      v._onDestroy(t, e)
                  }),
                  !this._model.readOnly() &&
                    y &&
                    y.widget().each(function (t, e) {
                      var i = +$(e).data('layout-tab-priority')
                      isNaN(i) && (i = p.TabPriority.Properties)
                      var a = ~~$(e).data('layout-tab-open'),
                        o = $(e).data('layout-tab')
                      void 0 === o && (o = p.TabNames.properties), v.appendToTab(e, o, i, a)
                    }),
                  this._model.readOnly() ||
                    !S ||
                    g.widget().is(':empty') ||
                    g.widget().each(function (t, e) {
                      var a = i('n3Kh'),
                        o = g instanceof a,
                        r = +$(e).data('layout-tab-priority')
                      TradingView.isNaN(r) && (r = o ? p.TabPriority.Coordinates : p.TabPriority.Inputs)
                      var n = ~~$(e).data('layout-tab-open'),
                        s = $(e).data('layout-tab')
                      void 0 === s && (s = o ? p.TabNames.coordinates : p.TabNames.inputs), v.appendToTab(e, s, r, n)
                    }),
                  m &&
                    m.widget().each(function (t, e) {
                      var a = +$(e).data('layout-tab-priority')
                      TradingView.isNaN(a) && (a = p.TabPriority.Style)
                      var o = ~~$(e).data('layout-tab-open'),
                        r = i('Yc1q')
                      !o && m instanceof r && (o = p.TabOpenFrom.Default)
                      var n = $(e).data('layout-tab')
                      void 0 === n && (n = p.TabNames.style), v.appendToTab(e, n, a, o)
                    }),
                  w &&
                    w.widget().each(function (t, e) {
                      var i = +$(e).data('layout-tab-priority')
                      TradingView.isNaN(i) && (i = p.TabPriority.Display)
                      var a = ~~$(e).data('layout-tab-open'),
                        o = $(e).data('layout-tab')
                      void 0 === o && (o = p.TabNames.properties), v.appendToTab(e, o, i, a)
                    }),
                  T &&
                    T.widget().each(function (t, e) {
                      v.appendToTab(e, p.TabNames.visibility, p.TabPriority.Display, !1)
                    }),
                  this._source instanceof o && !!this._source.metaInfo().pine)
                )
                  this._source.metaInfo()
                this.insertTabs(), this._helpItemRequired() && this._createHelp()
                var I = 110
                $('.js-dialog').each(function () {
                  var t = parseInt($(this).css('z-index'), 10)
                  t > I && (I = t)
                }),
                  D.css('z-index', I),
                  (P = $('<div class="main-properties main-properties-aftertabs"></div>').appendTo(x)),
                  (C = $('<div class="dialog-buttons">').appendTo(P))
                if (
                  (!b || window.is_authenticated) &&
                  m &&
                  'function' == typeof m.createTemplateButton &&
                  t.enabled('linetoolpropertieswidget_template_button')
                )
                  v._templateButton = m
                    .createTemplateButton({
                      popupZIndex: I,
                      defaultsCallback: e.onResetToDefault,
                      loadTemplateCallback: function () {
                        T && T.loadData(), g && g.loadData()
                      }
                    })
                    .addClass('tv-left')
                    .appendTo(C)
                else if (TradingView.isInherited(this._source.constructor, o)) {
                  var N = [
                      {
                        title: $.t('Reset Settings'),
                        action: e.onResetToDefault
                      },
                      {
                        title: $.t('Save As Default'),
                        action: function () {
                          v._source.properties().saveDefaults()
                        }
                      }
                    ],
                    L = $(
                      '<a href="#" class="_tv-button tv-left">' +
                        $.t('Defaults') +
                        '<span class="icon-dropdown"></span></a>'
                    )
                  L.on('click', function (t) {
                    t.preventDefault()
                    var e = $(this)
                    e.is('.active') || e.trigger('button-popup', [N, !0])
                  }).appendTo(C),
                    l(L, null, {
                      direction: 'down',
                      event: 'button-popup',
                      notCloseOnButtons: !0,
                      zIndex: I
                    })
                } else
                  $('<a class="_tv-button tv-left">' + $.t('Defaults') + '</a>')
                    .appendTo(C)
                    .click(e.onResetToDefault)
                $('<a class="_tv-button ok">' + $.t('OK') + '</a>')
                  .appendTo(C)
                  .click(function () {
                    v.hide()
                  }),
                  $('<a class="_tv-button cancel">' + $.t('Cancel') + '</a>')
                    .appendTo(C)
                    .on('click', function (t) {
                      V(0, !0)
                    }),
                  D.find('._tv-dialog-title a').on('click', V),
                  $(window).bind('keyup.hidePropertyDialog', function (t) {
                    13 === t.keyCode &&
                      'textarea' !== t.target.tagName.toLowerCase() &&
                      (v._templateButton && v._templateButton.trigger('hide-popup'), v.hide())
                  }),
                  $('select', x).each(function () {
                    var t = $(this),
                      e = 'tv-select-container dialog'
                    t.hasClass('tv-select-container-fontsize') && (e += ' tv-select-container-fontsize'),
                      t.selectbox({ speed: 100, classHolder: e })
                  }),
                  $('input[type="text"]', x).addClass('tv-text-input inset dialog'),
                  $('input.ticker', x).TVTicker(),
                  D.css('min-width', '400px'),
                  c.applyHandlers(D, e)
                var B = {
                  top: ($(window).height() - D.height()) / 2,
                  left: ($(window).width() - D.width()) / 2
                }
                return (
                  m && 'function' == typeof m.dialogPosition && (B = m.dialogPosition(B, D) || B),
                  c.positionDialog(D, B),
                  window.lineToolPropertiesToolbar && window.lineToolPropertiesToolbar.hide(),
                  s.emit('edit_object_dialog', {
                    objectType:
                      this._source === this._model.mainSeries()
                        ? 'mainSeries'
                        : this._source instanceof a
                        ? 'drawing'
                        : this._source instanceof o
                        ? 'study'
                        : 'other',
                    scriptTitle: this._source.title()
                  }),
                  D
                )
              }
            }
            function V(t, e) {
              v.hide(!!e)
            }
          }),
          (h.prototype._helpItemRequired = function () {
            return this._source._metaInfo && !!this._source._metaInfo.helpURL
          }),
          (h.prototype._createHelp = function () {
            var t = $('<a class="help" href="#" target="_blank" title="' + $.t('Help') + '"></a>')
            t.attr('href', this._source._metaInfo.helpURL), this._tabContainer.prepend(t)
          }),
          (h.prototype.dialogWidget = function () {
            return this._dialog
          }),
          (e.EditObjectDialog = h)
      }.call(this, i('Kxc7')))
    },
    Yc1q: function (t, e, i) {
      'use strict'
      var a = i('DxCR'),
        o = a.PropertyPage,
        r = a.ColorBinding,
        n = i('jNEI').addColorPicker
      function s(t) {
        function e(e, i, a) {
          t.call(this, e, i, a), (this._linetool = a)
        }
        return (
          inherit(e, t),
          (e.prototype.applyTemplate = function (t) {
            this.model().applyLineToolTemplate(this._linetool, t, 'Apply Drawing Template'), this.loadData()
          }),
          e
        )
      }
      function l(t, e, i) {
        o.call(this, t, e), (this._linetool = i)
      }
      inherit(l, o),
        (l.prototype.createOneColorForAllLinesWidget = function () {
          var t = $("<td class='colorpicker-cell'>")
          return (
            this.bindControl(
              new r(n(t), this._linetool.properties().collectibleColors, !0, this.model(), 'Change All Lines Color', 0)
            ),
            { label: $('<td>' + $.t('Use one color') + '</td>'), editor: t }
          )
        }),
        (l.prototype.addOneColorPropertyWidget = function (t) {
          var e = this.createOneColorForAllLinesWidget(),
            i = $('<tr>')
          i.append($('<td>')).append(e.label).append(e.editor), i.appendTo(t)
        }),
        ((l = s(l)).createTemplatesPropertyPage = s),
        (t.exports = l)
    },
    n3Kh: function (t, e, i) {
      'use strict'
      var a = i('DxCR'),
        o = a.PropertyPage,
        r = a.GreateTransformer,
        n = a.LessTransformer,
        s = a.ToIntTransformer,
        l = a.SimpleStringBinder
      function p(t, e, i) {
        o.call(this, t, e), (this._linetool = i), this.prepareLayout()
      }
      i('PVgW'),
        inherit(p, o),
        (p.BarIndexPastLimit = -5e4),
        (p.BarIndexFutureLimit = 15e3),
        (p.prototype.bindBarIndex = function (t, e, i, a) {
          var o = [s(t.value()), r(p.BarIndexPastLimit), n(p.BarIndexFutureLimit)]
          this.bindControl(this.createStringBinder(e, t, o, !0, i, a))
        }),
        (p.prototype.createPriceEditor = function (t) {
          var e = this._linetool,
            i = e.ownerSource().formatter(),
            a = function (t) {
              var e = i.parse(t)
              if (e.res) return e.value
            },
            o = $("<input type='text'>")
          if (
            (o.TVTicker({
              step: i._minMove / i._priceScale || 1,
              formatter: function (t) {
                return i.format(t)
              },
              parser: a
            }),
            t)
          ) {
            var r = [
                function (e) {
                  var i = a(e)
                  return void 0 === i ? t.value() : i
                }
              ],
              n = 'Change ' + e.title() + ' point price',
              s = this.createStringBinder(o, t, r, !1, this.model(), n)
            s.addFormatter(function (t) {
              return i.format(t)
            }),
              this.bindControl(s)
          }
          return o
        }),
        (p.prototype._createPointRow = function (t, e, i) {
          var a = $('<tr>'),
            o = $('<td>')
          o.html($.t('Price') + i), o.appendTo(a)
          var r = $('<td>')
          r.appendTo(a), this.createPriceEditor(e.price).appendTo(r)
          var n = $('<td>')
          n.html($.t('Bar #')), n.appendTo(a)
          var s = $('<td>')
          s.appendTo(a)
          var l = $("<input type='text'>")
          return (
            l.appendTo(s),
            l.addClass('ticker'),
            this.bindBarIndex(e.bar, l, this.model(), 'Change ' + this._linetool.title() + ' point bar index'),
            a
          )
        }),
        (p.prototype.prepareLayoutForTable = function (t) {
          for (var e = this._linetool.points(), i = e.length, a = 0; a < e.length; a++) {
            var o = e[a],
              r = this._linetool.properties().points[a]
            if (r) {
              var n = a || i > 1 ? ' ' + (a + 1) : ''
              this._createPointRow(o, r, n).appendTo(t)
            }
          }
        }),
        (p.prototype.prepareLayout = function () {
          ;(this._table = $(document.createElement('table'))),
            this._table.addClass('property-page'),
            this._table.attr('cellspacing', '0'),
            this._table.attr('cellpadding', '2'),
            this.prepareLayoutForTable(this._table),
            this.loadData()
        }),
        (p.prototype.widget = function () {
          return this._table
        }),
        (p.prototype.createStringBinder = function (t, e, i, a, o, r) {
          return new l(t, e, i, a, o, r)
        }),
        (t.exports = p)
    },
    ohga: function (t, e, i) {}
  }
])
