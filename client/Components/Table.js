import React from 'react';
import * as Store from '../Services/store.service';

const TableHeaders = ({ cols }) => {
  const thArr = cols.map((item, i) => {
    return (<th key={i}>{item}</th>);
  });

  return (
    <thead>
      <tr>{thArr}</tr>
    </thead>
  );
};

const TableBody = ({ rows, cols }) => {
  const trArr = rows.map((row, rowIndex) => {
    const tdArr = cols.map((colName, colIndex) => {
      return (<td key={colIndex}>{row[colName]}</td>);
    });
    return (<tr key={rowIndex}>{tdArr}</tr>);
  });
  return (<tbody>{trArr}</tbody>);
};

class Table extends React.Component {

  constructor(props) {
    super(props);
    this.handleSave = this.handleSave.bind(this);
  }

  handleSave() {
    console.log('handleSave() {');
    console.log(JSON.stringify(this.props.rows));

    Store.postCampaigns(this.props.rows)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <div>
        <h2>Preview</h2>
        <table className="table table-bordered table-hover">
          <TableHeaders cols={this.props.cols} />
          <TableBody rows={this.props.rows} cols={this.props.cols} />
        </table>
        <div className="action">
          <button className="btn btn-primary" onClick={this.handleSave}>Save</button>
        </div>
      </div >
    );
  }
}

export default Table;

