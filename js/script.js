function generateTable() {
	// Setup variables
	var input = quill.getContents().ops;
	var output = document.getElementById('table');

	var table = [];
	var counter = { outer: 0, inner: 1 };
	var categories = 0;
	var header;

	// Make sure that the input isn't empty
	if (input[0].insert.length === 1) {
		console.info('Empty input');
		return;
	}
	// Make sure we don't have an empty line at the end
	if (input.length % 2 === 1) {
		console.info('Ignoring last line');
		input.pop();
	}
	console.log(input.length);

	// Generate table
	for (var i = 0; i < input.length - 1; i += 2) {
		// Check if we're still in the header section of the table
		// Insert the table header and index
		if (i === 0 && input[i + 1].attributes.indent === undefined) {
			console.info('Entered header with index: ' + i);
			header = true;

			table.push('<table>');
			table.push('<thead>');
			table.push('<tr class="header">');
			table.push('<th class="index">A</th>');
		}

		// Check if we've exited the header section
		if (i !== 0 && input[i + 1].attributes.indent === undefined) {
			console.info('Exit header with index: ' + i);

			header = false;

			table.push('</tr>');
			table.push('</thead>');
			table.push('<tbody>');
		}

		// If we're in the header section insert the titles and categories
		if (header && input[i + 1].attributes.indent === 2) {
			console.info('Insert categories into header with index: ' + i);

			table.push(
				'<th class="item category">' + input[i].insert + '</th>'
			);

			categories++;
		} else if (header && input[i + 1].attributes.indent === undefined) {
			console.info('Insert header title with index: ' + i);

			table.push('<th class="title">' + input[i].insert + '</th>');
		} else if (header && input[i + 1].attributes.indent === 1) {
			console.info('Insert header description with index: ' + i);

			table.push('<th class="description">' + input[i].insert + '</th>');
		}

		// If we're in the body section, begin making sections
		if (!header && input[i + 1].attributes.indent === undefined) {
			console.info('Insert section header with index: ' + i);

			counter.outer++;
			counter.inner = 1;

			table.push('<tr class="sectionheader">');
			table.push('<td class="index">' + counter.outer + '</td>');
			table.push('<td>' + input[i].insert + '</td>');
		}

		// Check for section description and end section header
		if (!header && input[i + 1].attributes.indent === 1) {
			console.info('Insert the rest of section header');

			table.push('<td>' + input[i].insert) + '</td>';
			for (var j = 0; j < categories; j++) {
				table.push('<td></td>');
			}
			table.push('</tr>');
		}

		// Check for section items, start the section
		if (!header && input[i + 1].attributes.indent === 2) {
			console.info('Insert section items');

			table.push('<tr class="item">');
			table.push(
				'<td class="index">' +
					counter.outer +
					'.' +
					counter.inner +
					'</td>'
			);
			table.push('<td class="title">' + input[i].insert + '</td>');

			counter.inner++;
		}

		// Check if we're inserting section description and end section item
		if (!header && input[i + 1].attributes.indent === 3) {
			console.info('Insert section description');

			table.push('<td class="description">' + input[i].insert + '</td>');
			for (var j = 0; j < categories; j++) {
				table.push('<td></td>');
			}
			table.push('</tr>');
		}

		// Check if we're on the last item of the table
		if (i === input.length - 2) {
			console.info('Finishing table');

			table.push('</tbody>');
			table.push('</table>');

			output.innerHTML = table.join('');
		}
	}
}
