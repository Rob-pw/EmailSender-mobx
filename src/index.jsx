import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import DevTools from 'mobx-react-devtools';
import Select from 'react-select';
import Fuse from 'fuse.js';

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
    @observable filterText = '';
}();

function selectType(val) {
  var type = groupRepository.types.find(type => type.name === val.value);

  appState.selectedType = type;
}

@observer
class SearchBoxView extends Component {
  render() {
    var that = this;

    function setFilterText(event) {
      that.props.appState.filterText = event.target.value;
    }

    return (
      <div>
        <span>{this.props.appState.filterText}</span>
        <input type="search" onChange={setFilterText} />
      </div>
    );
  }
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
      const options = props.selected ?
        state.selectedContacts :
        getOptions(state.selectedType);

      if (!state.filterText)
        return options;

      const fuse = new Fuse(options, {
        keys: ['name', 'belongsTo.name']
      });

      return fuse.search(state.filterText);
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

@observer
class SendButtonView extends Component {
  render() {
    var state = this.props.appState;

    function isDisabled() {
      return state.selectedContacts.length <= 0;
    }

    return (
      <button
        onClick={() => alert(`Sent ${state.selectedContacts.length}`)}
        disabled={isDisabled}>
        Send!
      </button>
    );
  }
}

function clearSelected() {
  appState.selectedContacts = [];
}

ReactDOM.render(
  (
    <div>
      <SearchBoxView appState={appState} />
      <SelectGroupTypeView appState={appState} />
      <OptionSelectionView appState={appState} />
      <OptionSelectionView appState={appState} selected="true" />
      <button onClick={clearSelected}>Clear all</button>
      <SendButtonView appState={appState} />
    </div>
  ),
  document.getElementById('root')
);
