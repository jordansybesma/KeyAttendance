import React from 'react';
import Checkbox from'./Checkbox.js'

class Checkboxes extends React.Component {
    
    componentWillMount = () => {
        this.selectedCheckboxes = new Set();
    };

    toggleCheckbox = label => {
        if (this.selectedCheckboxes.has(label)) {
            this.selectedCheckboxes.delete(label);
        } else {
            this.selectedCheckboxes.add(label);
        }
    };

    handleFormSubmit = formSubmitEvent => {
        formSubmitEvent.preventDefault();
        const selectedBoxes = [];
        for (const checkbox of this.selectedCheckboxes) {
            selectedBoxes.push(checkbox);
        }

        alert('The following checkboxes are checked off: ' + selectedBoxes);

    };

    createCheckboxes = () => {
        var boxes = []
        const activities = this.props.row['activities'];
        const keys = Object.keys(activities);
        for (var i = 0; i < keys.length; i++) {
            boxes.push(
                <Checkbox
                    label={keys[i]}
                    handleCheckboxChange={this.toggleCheckbox}
                    key={keys[i]}
                    checked={activities[keys[i]]}
                />
            )
        }
        return boxes;
    };

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-sm-12">
                        {this.createCheckboxes()}

                        <form onSubmit={this.handleFormSubmit}>

                            <button className="btn btn-default" type="submit">Save</button>
                        </form>

                    </div>
                </div>
            </div>
        );
    }

}
export default Checkboxes;
