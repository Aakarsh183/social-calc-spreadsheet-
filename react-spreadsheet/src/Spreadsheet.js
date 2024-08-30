import React, { useState, useEffect } from 'react';
import './Spreadsheet.css';

const Spreadsheet = () => {
    const [data, setData] = useState(initializeData(10, 10)); // 10x10 grid

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

    return (
        <table className="spreadsheet">
            <thead>
                <tr>
                    <th></th>
                    {data[0].map((_, colIndex) => (
                        <th key={colIndex}>{String.fromCharCode(65 + colIndex)}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        <th>{rowIndex + 1}</th>
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
