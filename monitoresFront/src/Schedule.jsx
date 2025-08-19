import Cell from "./Cell.jsx";

export default function Schedule({
    days, renderTable, hourSlots
}) {



    
    return (
        <>
        <div className="grid col-10">
            {days.length <= 7 ? (
                renderTable(days, hourSlots)
            ) : (
                <>
                    {renderTable(days.slice(0, 7), hourSlots)}
                    {renderTable(days.slice(7), hourSlots)}
                </>
            )}
        </div>
        </>
    );
}