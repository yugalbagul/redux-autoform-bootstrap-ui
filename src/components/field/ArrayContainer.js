import PropTypes from 'prop-types';
import React, { Component } from 'react';
import GlyphButton from '../common/GlyphButton.js';
import Alert from 'react-bootstrap/lib/Alert';
import Button from 'react-bootstrap/lib/Button'
import FormGroup from '../common/FormGroup';
import ArrayContainerItem from '../common/ArrayContainerItem';

class ArrayContainer extends Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        addText: PropTypes.string
    };

    handleAdd = () => {
        let { reduxFormProps } = this.props;
        reduxFormProps.addField({});
    };

    handleItemAction = (index, eventKey) => {
        let { id, value, fields, onChange, reduxFormProps: { swapFields, removeField } } = this.props;

        switch (eventKey) {
            case "remove":
                removeField(index);
                break;
            case "moveUp":
                if (index > 0) {
                    swapFields(index, index - 1);
                }
                break;
            case "moveDown":
                if (index < fields.length - 1) {
                    swapFields(index, index + 1);
                }
                break;
            case "moveFirst":
                swapFields(index, 0);
                break;
            case "moveLast":
                swapFields(index, fields.length - 1);
                break;
        }

        if (onChange) {
            let values = {
                id: id,
                value: value
            };
            
            onChange(values);
        }
    };
    
    buildGroupComponent = (field) => {
        let { componentFactory, layout, disabled } = this.props;

        field = field.map((field)=>( { ...field, disabled} ));

        return componentFactory.buildGroupComponent({
            component: layout.component,
            layout: layout,
            fields: field,
            componentFactory: componentFactory
        });
    };
    
    getComponents = () => {
        let { fields } = this.props;

        return fields.map((field, index) => (
            <ArrayContainerItem key={index} index={index} onAction={this.handleItemAction}>
                { this.buildGroupComponent(field) }
            </ArrayContainerItem>
        ));
    };
    
    getAddBar = () => {
        let { addText, disabled } = this.props;
        
        let text = addText ? addText : "Add";
        let components = this.getComponents();

        if (components.length) {
            return (
                <div className="add-bar">
                    <span>
                        <GlyphButton glyph="plus" text={text} bsSize="small" onClick={this.handleAdd} disabled={disabled}/>
                    </span>
                </div>
            ); 
            
        } else {
            return null;
        }
    };
    
    getAllComponents = () => {
        //TODO: We should replace a for button!
        const { disabled } = this.props;
        let components = this.getComponents();
        
        if (components.length) {
            return components;
        } else {
            return (
                <Alert bsStyle="warning">
                    This array is empty. Consider <Button bsStyle="link" disabled={disabled} onClick={ this.handleAdd }>adding a new item</Button>.
                </Alert>
            );
        }
    };

    render() {
        let { displayName, fieldLayout, innerSize, name } = this.props;
        let formGroupProps = { displayName, name, fieldLayout, innerSize };
        let components = this.getAllComponents();
        let addBar = this.getAddBar();

        return (
            <FormGroup {...formGroupProps}>
                <div className="array-container-content">
                    { components }
                </div>
                { addBar }
            </FormGroup>
        );
    }
}

export default ArrayContainer;