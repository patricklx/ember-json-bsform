import Ember from 'ember';
import template from './template'

export default Ember.Component.extend({
  layout: template,
  normalTypes: ['text', 'number', 'email', 'textarea'],

  field: null,
  name: null,
  fieldsetName: null,
  form: null,

  init() {
    var path;
    this._super();
    path = this.get('formPath');
    Ember.defineProperty(this, "validation", Ember.computed.oneWay("form.validations.attrs." + path))
  },

  formPath: Ember.computed('fieldsetName', 'name', function () {
    return [this.get('form.rootPath'),this.get('fieldsetName'),this.get('name')].join('.');
  }),

  showMessage: Ember.computed('form.didValidate', 'validation.isInvalid', 'validation.isDirty', function(){
    return this.get('form.didValidate') ||
      (this.get('validation.isInvalid') && this.get('validation.isDirty'));
  }),

  isGroup: Ember.computed('field.addon.prefix', 'field.addon.suffix', function () {
    return Boolean(this.get('field.addon.prefix') || this.get('field.addon.suffix'))
  }),

  isNormalInput: Ember.computed('field.type', function () {
    return this.normalTypes.indexOf(this.get('field.type')) >= 0;
  }),

  fieldComponent: Ember.computed('field.type', function () {
    if (this.get('isNormalInput')) {
      return 'json-form/input';
    }
    return 'json-form/' + this.get('field.type');
  }),

  setValue(value) {
    if (this.get('isDestroyed')) {
      return
    }
    this.set('form.'+this.get('formPath'), value);
    if (this.attrs.onChange) {
      this.attrs.onChange(value);
    }
  },

  didInsertElement() {
    this._super();
    Ember.run.next(this, function () {
      var validation, key;
      validation = this.get('validation');
      if (this.get('form.' + validation.attribute) == '') {
        this.set('form.' + validation.attribute, undefined);
      }
      this.set('form.' + validation.attribute + '__enabled', true);
    })
  },

  willDestroyElement() {
    this._super();
    var form = this.get('form');
    var validation = this.get('validation');
    Ember.run.next(this, function () {
      form.set(validation.attribute + '__enabled', false);
    })
  },

  actions: {
    onChange(value) {
      if (value instanceof Ember.$.Event) {
        value = value.target.value;
      }

      //had some issues when I wanted to click somewhere the controls jumped to other positions
      //and the the click went nowhere, this fixes it
      Ember.run.debounce(this, this.setValue, value, 100);
    }
  }
});