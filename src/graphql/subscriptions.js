/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateNote = /* GraphQL */ `
  subscription OnCreateNote(
    $filter: ModelSubscriptionNoteFilterInput
    $owner: String
  ) {
    onCreateNote(filter: $filter, owner: $owner) {
      id
      name
      description
      image
      owner
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateNote = /* GraphQL */ `
  subscription OnUpdateNote(
    $filter: ModelSubscriptionNoteFilterInput
    $owner: String
  ) {
    onUpdateNote(filter: $filter, owner: $owner) {
      id
      name
      description
      image
      owner
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteNote = /* GraphQL */ `
  subscription OnDeleteNote(
    $filter: ModelSubscriptionNoteFilterInput
    $owner: String
  ) {
    onDeleteNote(filter: $filter, owner: $owner) {
      id
      name
      description
      image
      owner
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateUserInfo = /* GraphQL */ `
  subscription OnCreateUserInfo(
    $filter: ModelSubscriptionUserInfoFilterInput
    $owner: String
  ) {
    onCreateUserInfo(filter: $filter, owner: $owner) {
      id
      noteNum
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onUpdateUserInfo = /* GraphQL */ `
  subscription OnUpdateUserInfo(
    $filter: ModelSubscriptionUserInfoFilterInput
    $owner: String
  ) {
    onUpdateUserInfo(filter: $filter, owner: $owner) {
      id
      noteNum
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onDeleteUserInfo = /* GraphQL */ `
  subscription OnDeleteUserInfo(
    $filter: ModelSubscriptionUserInfoFilterInput
    $owner: String
  ) {
    onDeleteUserInfo(filter: $filter, owner: $owner) {
      id
      noteNum
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
