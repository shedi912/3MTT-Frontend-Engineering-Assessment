
function AlertBox(props){

    return (
        <div className="alert-box">
            <div className="alert-msg">{props.msg}</div>
            <div className="close-alert" onClick={props.onClick}>X</div>
        </div>
    );

}

export default AlertBox;