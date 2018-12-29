import React from 'react';

class Alerts extends React.Component {

    componentWillMount() {
        if (!this.props.user.is_staff) {
            this.props.history.replace('/attendance');
        }
    }
    
    render() {
        return (
            <div className='content'>
                <p>Alerts</p>
            </div>
        );
    }
}

export default Alerts;