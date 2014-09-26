require('reactive-ie8-shims');

var domify = require('domify');
var assert = require('assert');

var reactive = require('../');

describe('plugins', function(){
  it('should allow plugins to work', function () {
    var view = reactive()
      .use(function () {})
      .render('<div></div>')

    assert(view.el.tagName.toUpperCase() === 'DIV')
  })

  it('should allow bindings using .bind()', function () {
    var view = reactive()
      .bind('add-exclamation', addExclamation)
      .render('<p add-exclamation="">hey</p>')

    assert(view.el.textContent == 'hey!')

    function addExclamation(el, attr) {
      el.textContent = el.textContent + '!'
    }
  })

  it('should allow plugins to add bindings', function () {
    var view = reactive()
      .use(addExclamationPlugin)
      .render('<p add-exclamation="">hey</p>')

    assert(view.el.textContent == 'hey!')

    function addExclamationPlugin(reactive) {
      reactive.bind('add-exclamation', function (el, attr) {
        el.textContent = el.textContent + '!'
      })
    }
  })

  it('should allow plugins to get/set values', function () {
    var view = reactive({ foo: 'bar' })
      .use(bindFoo)
      .render('<p bar></p>')

    assert(view.el.textContent == 'GO!')
    assert(view.get('foo') == 'not-bar')

    function bindFoo(reactive) {
      reactive.bind(reactive.get('foo'), function (el) {
        el.textContent = 'GO!'
        reactive.set('foo', 'not-bar')
      })
    }
  })

  it('should pass bindings to subviews', function () {
    var view = reactive()
      .bind('lolz', function (el, attr) { el.textContent = 'lol' })
      .render('<p></p>')

    var subview = view.subview()
      .render('<p lolz></p>')

    assert(subview.el.textContent == 'lol')
  })

  it('should pass bindings set in plugins to subviews', function () {
    var view = reactive()
      .use(function (reactive) { reactive.bind('lolz', function (el, attr) { el.textContent = 'lol' }) })
      .render('<p></p>')

    var subview = view.subview()
      .render('<p lolz></p>')

    assert(subview.el.textContent == 'lol')
  })

  it('should pass bindings set in plugins to each-created subviews', function () {
    var view = reactive({arr: [1,2,3]})
      .use(function (reactive) { reactive.bind('lolz', function (el, attr) { el.textContent = 'lol' }) })
      .render('<div><p each="arr" lolz></p></div>')

    assert(view.el.children[0].textContent == 'lol')
    assert(view.el.children[1].textContent == 'lol')
    assert(view.el.children[2].textContent == 'lol')
  })
})
