// @ts-ignore
import columnify = require('columnify');
import * as Table from 'cli-table3';
import chalk from 'chalk';
import * as capitalize from 'capitalize';

const BRAND = {
  heading: chalk.rgb(224, 78, 58),
  title: chalk.rgb(246, 234, 231),
};

export default class ConsoleWriter {
  columns: number;

  constructor({ columns } = process.stdout) {
    this.columns = typeof columns !== 'undefined' && columns < 80 ? columns : 80;
  }

  heading(heading: string) {
    this.divider();
    this.text(BRAND.heading(`${this.indent()}${heading}`));
    this.divider();
    this.line();
  }

  divider() {
    console.log('-'.repeat(this.columns));
  }

  text(text: string) {
    console.log(text);
  }

  indent(spaces: number = 2) {
    return ' '.repeat(spaces);
  }

  line() {
    console.log(' ');
  }

  column(data: { [key: string]: string }) {
    let keys = Object.keys(data);

    console.log(
      columnify(data, {
        showHeaders: false,
        minWidth: 20,
        dataTransform: (data: string) => {
          return keys.includes(data) ? BRAND.title(`${this.indent()}${capitalize(data)}`) : data;
        },
      })
    );
  }

  table(heading: string, rowData: string[]) {
    let table: Table.HorizontalTable = new Table({
      head: [heading],
    }) as Table.HorizontalTable;

    rowData.forEach((value: string) => {
      table.push([value]);
    });

    console.log(table.toString());
  }
}
