import Ember from 'ember';
import template from './template';

export default Ember.Component.extend({
  layout: template,
  tagName: '',
  textAreaElementId: Ember.computed(function () {
    return Ember.guidFor(this);
  }),

  _value: Ember.computed('value', function () {
    return this.get('value');
  }),

  value: Ember.computed({
    get(){},
    set(key, val){
      Ember.run.next(() => {
        let eId = this.get('textAreaElementId');
        let e = Ember.$(`#${eId} textarea`);
        if (e[0]) {
          e.css({'height':'auto', 'overflow-y': 'hidden'}).height(e[0].scrollHeight);
          e.css({'overflow-y': 'auto'});
        }
      });
      return val;
    }
  }),

  actions: {

    onChange(value) {
      if (value === '') {
        value = undefined;
      }
      this.onChange(value);
      let eId = this.get('textAreaElementId');
      let e = Ember.$(`#${eId} textarea`);
      e.css({'height':'auto', 'overflow-y': 'hidden'}).height(e[0].scrollHeight);
      e.css({'overflow-y': 'auto'});
    }
  }
});
