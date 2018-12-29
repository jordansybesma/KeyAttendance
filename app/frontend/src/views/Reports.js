import React from 'react';

class Reports extends React.Component {

    componentWillMount() {
        if (!this.props.user.is_staff) {
            this.props.history.replace('/attendance');
        }
    }
    
    render() {
        return (
            <div className='content'>
                <p>Reports</p>
            </div>
        );
    }
}

export default Reports;