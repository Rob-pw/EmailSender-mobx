import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import DevTools from 'mobx-react-devtools';
import Select from 'react-select';

const class3B = { name: 'Class 3B' };
const class4D = { name: 'Class 4D' };
const dicks = { name: 'Dicks' };
const harrys = { name: 'Harrys' };
const individuals = { name: 'Individuals' };

const groupRepository = new class GroupRepository {
  @observable types = [{
    name: 'Classes',
    values: [class3B, class4D]
  }, {
    name: 'Groups',
    values: [dicks, harrys]
  }, individuals];

  defaultType = this.types[0];
}();

function Contact({name, belongsTo}) {
  this.name = name;
  this.belongsTo = belongsTo;
}

const contactRepository = new class ContactRepository {
  @observable contacts = [new Contact({
    name: 'Dick A',
    belongsTo: [class3B, dicks]
  }), new Contact({
    name: 'Harry A',
    belongsTo: [class4D, harrys]
  })];
}();

function getOptions(type) {
  if (type === individuals)
    return contactRepository.contacts;

  return type.values;
}

function getContacts(option) {
  if (option instanceof Contact)
    return [option]

  return contactRepository.contacts.filter(contact => {
    return contact.belongsTo.indexOf(option) !== -1;
  });
}

const appState = new class AppState {
    @observable selectedType = groupRepository.defaultType;
    @observable selectedContacts = [];
}();

function selectType(val) {
  var type = groupRepository.types.find(type => type.name === val.value);

  appState.selectedType = type;
}

@observer
class SelectGroupTypeView extends Component {
  render() {
   return (
      <Select
        name = "type"
        value = {this.props.appState.selectedType.name}
        options = {groupRepository.types.map(type => ({ value: type.name, label: type.name }))}
        onChange = {selectType}
      />
    );
  }
};

@observer
class OptionSelectionView extends Component {
  render() {
    var props = this.props;
    var state = props.appState;

    function toggle(option) {
      var contacts = getContacts(option);

      console.log(contacts);

      contacts.forEach(contact => {
        var index = state.selectedContacts.indexOf(contact);

        if (index !== -1) {
          state.selectedContacts.splice(index, 1);
        } else {
          state.selectedContacts.push(contact);
        }
      })
    }

    function getOptionsToDisplay() {
      return props.selected ?
        state.selectedContacts :
        getOptions(state.selectedType);
    }

    return (
      <ul>
        { getOptionsToDisplay().map(
          option => <li onClick={ () => toggle(option) }>{option.name}</li>
        ) }
      </ul>
    )
  }
}

ReactDOM.render(
  (
    <div>
      <SelectGroupTypeView appState={appState} />
      <OptionSelectionView appState={appState} />
      <OptionSelectionView appState={appState} selected="true" />
    </div>
  ),
  document.getElementById('root')
);
