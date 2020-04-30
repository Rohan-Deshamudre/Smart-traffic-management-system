import * as React from 'react';
import '../styles/search.scss';
import FormControl from "react-bootstrap/FormControl";

type List = { id: number, name: string, items: {id: number, name: string}[] }[];

type Props = {
	list: List,
	items: any[],
	handleList: (list: List) => void,
	handleItems: (list: any[]) => void
}

type State = {
	input: string
}

/*
	Search input through folders.
	Used by: [Leftpane] and [RightPane] in [Home].
 */
class Search extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			input: ''
		};
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(e: React.ChangeEvent<HTMLInputElement>) {

		if (e.target.value.length) {
			const searchPattern = new RegExp(e.target.value.split(' ').map(term => `(?=.*${term})`).join(''), 'i');
			this.props.handleList(this.props.list.filter(item =>
				this.folderMatcher(item, searchPattern)
			));
			this.props.handleItems(this.props.items.filter(item =>
				this.itemMatcher(item, searchPattern)
			));
		} else {
			this.props.handleList(this.props.list);
			this.props.handleItems(this.props.items);
		}
	}

	folderMatcher(item, searchPattern){
		const type = item.folderType.id;
		let matchedChilds = [];
		switch(type){
			case "1":
				matchedChilds = item["scenarios"].filter(child => this.itemMatcher(child, searchPattern));
				break;
			default:
				return item.name.match(searchPattern)
		}


		return matchedChilds.length > 0 ? item : item.name.match(searchPattern)

	}

	itemMatcher(item, searchPattern){
		if( item.labels !== undefined  && this.labelMatcher(item.labels, searchPattern)){
			return item
		}
		return item.name.match(searchPattern)

	}

	labelMatcher(labels: any[], searchPattern){
		const fitlerLabels = labels.filter(label => label.label.match(searchPattern))
		return fitlerLabels.length > 0;
	}

	render() {
		return (
			<FormControl type="text" placeholder="Naam, locatie, event..." className="search-input"
						 onChange={(e) => {
						 	this.setState({input: e.target.value });
							 this.handleChange(e);
						 }}
						 value={this.state.input}
			/>
		);
	}
}

export default Search;
