
/*
    Things to remember:
    1. the data must have id, if id is needed to be display, 
    refactor this component include a condtion that allow id to be display on table body,
    by default id is filter out in the ternary operator
*/
function Table({heading, data, handleTableRowClick, selectedRow}){
    
    return (
        <table>
            <thead>
                {/* Build table header with passed in headers*/}
                <tr><th>{heading[0]}</th><th style={{width:'25%'}}>{heading[1]}</th><th style={{width:'40%'}}>{heading[2]}</th><th>{heading[3]}</th></tr>
            </thead>
            <tbody>
                
                {data.map((row, h) => (
                    <tr key={row.id} onClick={()=>handleTableRowClick(row.id)} className={selectedRow === row.id? 'selectedRow':''}>
                        <td>{h+1}</td>
                        <td>{row.name}</td>
                        <td>{row.description}</td>
                        <td>{new Date(row.created_at).toLocaleDateString('en-GB')}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default Table;