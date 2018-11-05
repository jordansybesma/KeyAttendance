import React from 'react';
import Checkbox from'./Checkbox.js'


const activities = [
    'The Key',
    'Art',
    'Food',
    'Leadership Y B M',
    'Health / Wellness',
    'Volunteering',
    'Housing',
    'One-on-One'
];

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

    createCheckbox = label => (
        <Checkbox
            label={label}
            handleCheckboxChange={this.toggleCheckbox}
            key={label}
        />
    );

    createCheckboxes = () => (
        activities.map(this.createCheckbox)
    );

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
