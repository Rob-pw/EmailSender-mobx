export default (function () {
  class GroupRepository {
    @observable types = [{
      name: 'Classes',
      values: [{
        name: 'Class 3B'
      }, {
        name: 'Class 4D'
      }]
    }, {
      name: 'Groups',
      values: [{
        name: 'Bobs'
      }, {
        name: 'Robs'
      }]
    }];
  }

  return new GroupRepository();
}());
