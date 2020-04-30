import gql from "graphql-tag";

export const READ_LABELS = gql`
query ReadLabels($labelId: Int, $name: String) {
    labels(labelId: $labelId, name: $name) {
        id
        label
        description
    }
}
`;