
function Button(props){
    var color = props.color;
    return (
        <button 
            className="add-task" 
            onClick={props.onClick}
        >{props.text}</button>
    )
}



Button.defaultProps = {
    text: 'Add'
}

export default Button;