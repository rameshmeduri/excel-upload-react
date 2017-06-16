/* eslint-disable no-undef */

import React, { Component } from 'react';
import XLSX from 'xlsx';
import Table from './Table';

const cols = ['Start', 'End', 'Type', 'Agent', 'HomeText', 'DiscountText'];

class Form extends Component {

  constructor(props) {
    super(props);
    this.state = { rows: [] };
    this.handleChange = this.handleChange.bind(this);
    this.readFile = this.readFile.bind(this);
  }

  readFile(e) {
    const data = XLSX.read(e.target.result, { type: 'binary' });
    const sheets = this.toJson(data);
    const firstSheet = Object.keys(sheets)[0];
    this.setState({ rows: sheets[firstSheet] });
  }

  handleChange(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    if (file) {
      reader.readAsBinaryString(file);
    }
    reader.onload = this.readFile;
  }

  toJson(workbook) {
    let result = {};
    workbook.SheetNames.forEach((sheetName) => {
      let rows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
      if (rows.length) {
        result[sheetName] = rows;
      }
    });
    return result;
  }

  render() {
    let grid;
    if (this.state.rows.length) {
      grid = <Table cols={cols} rows={this.state.rows} />;
    } else {
      grid = <div />;
    }
    return (
      <div>
        <form className="form-horizontal">
          <h2>Campaign Discount Management</h2>
          <div className="form-group">
            <label
              htmlFor="excelFile"
              className="col-sm-2 control-label">Select a XLSX file:
            </label>
            <div className="col-sm-10">
              <input
                type="file"
                onChange={this.handleChange}
                className="form-control"
                id="excelFile"
              />
            </div>
          </div>
        </form>

        {grid}

      </div>
    );
  }
}

export default Form;
