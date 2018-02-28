/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

const React = require('react');
const RulePicker = require('./RulePicker.react.js');
const RuleActions = require('../data/RuleActions');
const TransformationSettings = require('./TransformationSettings.react.js');

import { Set } from 'immutable';
import RuleCategories from '../models/RuleCategories';
import { Accordion, Dropdown, Icon } from 'semantic-ui-react';
import { RuleFactory } from '../models/Rule';
import type { Props } from '../containers/AppContainer.react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import EditorActions from '../data/EditorActions';
import type { RuleCategory } from '../models/RuleCategories';
import FileTools from './FileTools.react';

function getLabelIcon(category: RuleCategory): string {
  switch (category) {
    case RuleCategories.ADVANCED:
      return 'settings';
    case RuleCategories.BASIC:
      return 'check circle';
    case RuleCategories.TEXT:
      return 'font';
    case RuleCategories.MEDIA:
      return 'video';
    case RuleCategories.WIDGETS:
      return 'browser';
    default:
      return '';
  }
}

const SortableItem = SortableElement((props: any) => <RulePicker {...props} />);

const SortableList = SortableContainer((props: any) => {
  return (
    <ul>
      {props.items.map((rule, index) => (
        <SortableItem
          {...props}
          key={rule.guid}
          index={index}
          rule={rule}
          value={rule}
        />
      ))}
    </ul>
  );
});

type AccordionItemProps = {
  index: number
};

type State = {
  activeAccordionIndex: number
};

class RuleList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { activeAccordionIndex: 0 };
  }

  handleAddRule = (event: Event) => {
    const selectElement = event.target;
    if (selectElement instanceof HTMLSelectElement) {
      const ruleDefinition = this.props.ruleDefinitions.get(
        selectElement.value
      );
      if (ruleDefinition != null) {
        RuleActions.addRule(RuleFactory({ definition: ruleDefinition }));
        EditorActions.filterRules(
          this.props.editor.categories.add(ruleDefinition.category)
        );
      }
    }
  };

  handleSortEnd = ({
    oldIndex,
    newIndex,
  }: {
    oldIndex: number,
    newIndex: number
  }) => {
    RuleActions.changeOrder(oldIndex, newIndex);
  };

  handleChangeFilters = (event: Event, data: { value: string[] }) => {
    EditorActions.filterRules(Set(data.value));
  };

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.rules.count() < this.props.rules.count() &&
      this.props.rules
        .filter(rule =>
          this.props.editor.categories.has(rule.definition.category)
        )
        .count() > 1
    ) {
      this.refs.scrollable.scrollTop = 99999;
    }
  }

  handleAccordionTitleClick = (e: Event, itemProps: AccordionItemProps) => {
    const { index } = itemProps;
    const { activeAccordionIndex } = this.state;
    const newIndex = activeAccordionIndex === index ? -1 : index;

    this.setState({ activeAccordionIndex: newIndex });
  };

  render() {
    return (
      <div className="rule-list">
        <FileTools {...this.props} />
        <Accordion fluid styled>
          <Accordion.Title
            index={0}
            active={this.state.activeAccordionIndex === 0}
            onClick={this.handleAccordionTitleClick}
          >
            <label>
              <Icon name="dropdown" />Content Transformation
            </label>
          </Accordion.Title>
          <Accordion.Content active={this.state.activeAccordionIndex === 0}>
            <div className="rule-filters">
              <label>
                <Icon name="filter" />Filter Rules:
              </label>
              <Dropdown
                multiple
                labeled
                fluid
                selection
                closeOnChange={true}
                options={Object.values(RuleCategories).map(
                  (category: RuleCategory) => ({
                    text: category,
                    value: category,
                    icon: getLabelIcon(category),
                  })
                )}
                renderLabel={item => ({
                  content: item.text,
                  icon: item.icon,
                })}
                text="Pick at least 1 category"
                value={this.props.editor.categories.toArray()}
                onChange={this.handleChangeFilters}
              />
            </div>
            <label>
              <Icon name="list" />Rules:
            </label>
            <select
              className="rule-selector"
              onChange={this.handleAddRule}
              value=""
            >
              <option value="" disabled={true}>
                + Add a new rule...
              </option>
              <optgroup label="-----------------------------------" />
              {Object.values(RuleCategories).map((category: RuleCategory) => (
                <optgroup key={category} label={category + ' rules'}>
                  {this.props.ruleDefinitions
                    .sortBy(defintion => defintion.displayName)
                    .valueSeq()
                    .filter(definition => definition.category == category)
                    .map(ruleDefinition => (
                      <option
                        key={ruleDefinition.name}
                        value={ruleDefinition.name}
                        disabled={
                          !this.props.editor.categories.contains(
                            ruleDefinition.category
                          )
                        }
                      >
                        {ruleDefinition.displayName}
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
            <div className="scrollable" ref="scrollable">
              <SortableList
                {...this.props}
                pressDelay={200}
                items={this.props.rules.valueSeq()}
                onSortEnd={this.handleSortEnd}
              />
            </div>
          </Accordion.Content>
          <TransformationSettings
            accordionActive={this.state.activeAccordionIndex === 1}
            accordionIndex={1}
            onAccordionTitleClick={this.handleAccordionTitleClick}
            {...this.props}
          />
        </Accordion>
      </div>
    );
  }
}

module.exports = RuleList;
