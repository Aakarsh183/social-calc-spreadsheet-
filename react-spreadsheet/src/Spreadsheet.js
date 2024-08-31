import React, { useState, useEffect } from 'react';
import './Spreadsheet.css';

const Spreadsheet = () => {
    const [data, setData] = useState(initializeData(100, 10));
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleCellChange = (rowIndex, colIndex, value) => {
        const newData = [...data];
        newData[rowIndex][colIndex] = value;
        setData(newData);
    };

    const handleKeyDown = (e, rowIndex, colIndex) => {
        const { key } = e;
        if (key === 'Enter') {
            e.preventDefault();
            if (rowIndex < data.length - 1) {
                document.getElementById(`cell-${rowIndex + 1}-${colIndex}`).focus();
            }
        } else if (key === 'ArrowDown' && rowIndex < data.length - 1) {
            document.getElementById(`cell-${rowIndex + 1}-${colIndex}`).focus();
        } else if (key === 'ArrowUp' && rowIndex > 0) {
            document.getElementById(`cell-${rowIndex - 1}-${colIndex}`).focus();
        } else if (key === 'ArrowRight' && colIndex < data[rowIndex].length - 1) {
            document.getElementById(`cell-${rowIndex}-${colIndex + 1}`).focus();
        } else if (key === 'ArrowLeft' && colIndex > 0) {
            document.getElementById(`cell-${rowIndex}-${colIndex - 1}`).focus();
        }
    };

    const handleBlur = (e, rowIndex, colIndex) => {
        const value = e.target.textContent;
        if (value.startsWith('=')) {
            const result = evaluateExpression(value.slice(1), data);
            handleCellChange(rowIndex, colIndex, result);
        }
    };

    const addRow = () => {
        setData([...data, Array(data[0].length).fill('')]);
    };

    const deleteRow = () => {
        if (data.length > 1) {
            setData(data.slice(0, -1));
        }
    };

    const addColumn = () => {
        const newData = data.map(row => [...row, '']);
        setData(newData);
    };

    const deleteColumn = () => {
        if (data[0].length > 1) {
            const newData = data.map(row => row.slice(0, -1));
            setData(newData);
        }
    };

    const saveData = () => {
        console.log('Saved Data:', data);
        alert('Data saved successfully!');
    };

    const logOut = () => {
        alert('Logged out successfully!');
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

     const sortColumn = (colIndex) => {
        const sortedData = [...data].sort((a, b) => {
            if (a[colIndex] < b[colIndex]) return -1;
            if (a[colIndex] > b[colIndex]) return 1;
            return 0;
        });
        setData(sortedData);
    };


    const sortRow = (rowIndex) => {
        const sortedData = data[0].map((_, colIndex) =>
            data.map((row) => row[colIndex])
        ).sort((a, b) => {
            if (a[rowIndex] < b[rowIndex]) return -1;
            if (a[rowIndex] > b[rowIndex]) return 1;
            return 0;
        });

        const newData = sortedData[0].map((_, colIndex) =>
            sortedData.map((row) => row[colIndex])
        );
        setData(newData);
    };
    return (
        <div>
          <Navbar
                toggleDropdown={toggleDropdown}
                dropdownOpen={dropdownOpen}
                addRow={addRow}
                deleteRow={deleteRow}
                addColumn={addColumn}
                deleteColumn={deleteColumn}
                saveData={saveData}
                logOut={logOut}
            />
        <table className="spreadsheet">
            <thead>
                <tr>
                    <th></th>
                    {data[0].map((_, colIndex) => (
                        <th key={colIndex}>
                        {String.fromCharCode(65 + colIndex)}
                         <button onClick={() => sortColumn(colIndex)}>Sort Col</button>
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        <th>
                        {rowIndex + 1}
                        <button onClick={() => sortRow(rowIndex)}>Sort Row</button>
                        </th>
                        {row.map((cell, colIndex) => (
                            <td
                                key={colIndex}
                                id={`cell-${rowIndex}-${colIndex}`}
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => handleBlur(e, rowIndex, colIndex)}
                                onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                                onInput={(e) =>
                                    handleCellChange(rowIndex, colIndex, e.currentTarget.textContent)
                                }
                            >
                                {cell}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
     </div>
    );
};

const Navbar = ({ toggleDropdown, dropdownOpen, addRow, deleteRow,addColumn, deleteColumn, saveData, logOut }) => {
    return (
        <nav className={`navbar ${dropdownOpen ? 'active' : ''}`}>
            <button className="dropdown-btn" onClick={toggleDropdown}>
                Menu
            </button>
            {dropdownOpen && (
                <div className="dropdown-content">
                    <button onClick={addRow}>Add Row</button>
                    <button onClick={deleteRow}>Delete Row</button>
                    <button onClick={addColumn}>Add Column</button>
                    <button onClick={deleteColumn}>Delete Column</button>
                    <button onClick={saveData}>Save</button>
                    <button onClick={logOut}>Log Out</button>
                </div>
            )}
        </nav>
    );
};

const initializeData = (rows, cols) => {
    return Array.from({ length: rows }, () => Array.from({ length: cols }, () => ''));
};

const evaluateExpression = (expression, data) => {
    try {
        const formula = expression.replace(/([A-Z]+)(\d+)/g, (_, col, row) => {
            const colIndex = col.charCodeAt(0) - 65;
            const rowIndex = parseInt(row) - 1;
            return data[rowIndex][colIndex] || 0;
        });
        return eval(formula);
    } catch (error) {
        return 'Error';
    }
};

export default Spreadsheet;
