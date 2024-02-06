/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { Button, Flex, Grid, TextField } from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { getUserInfo } from "../graphql/queries";
import { updateUserInfo } from "../graphql/mutations";
const client = generateClient();
export default function UserInfoUpdateForm(props) {
  const {
    id: idProp,
    userInfo: userInfoModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    noteNum: "",
  };
  const [noteNum, setNoteNum] = React.useState(initialValues.noteNum);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = userInfoRecord
      ? { ...initialValues, ...userInfoRecord }
      : initialValues;
    setNoteNum(cleanValues.noteNum);
    setErrors({});
  };
  const [userInfoRecord, setUserInfoRecord] = React.useState(userInfoModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getUserInfo.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getUserInfo
        : userInfoModelProp;
      setUserInfoRecord(record);
    };
    queryData();
  }, [idProp, userInfoModelProp]);
  React.useEffect(resetStateValues, [userInfoRecord]);
  const validations = {
    noteNum: [],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          noteNum: noteNum ?? null,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await client.graphql({
            query: updateUserInfo.replaceAll("__typename", ""),
            variables: {
              input: {
                id: userInfoRecord.id,
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "UserInfoUpdateForm")}
      {...rest}
    >
      <TextField
        label="Note num"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={noteNum}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              noteNum: value,
            };
            const result = onChange(modelFields);
            value = result?.noteNum ?? value;
          }
          if (errors.noteNum?.hasError) {
            runValidationTasks("noteNum", value);
          }
          setNoteNum(value);
        }}
        onBlur={() => runValidationTasks("noteNum", noteNum)}
        errorMessage={errors.noteNum?.errorMessage}
        hasError={errors.noteNum?.hasError}
        {...getOverrideProps(overrides, "noteNum")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || userInfoModelProp)}
          {...getOverrideProps(overrides, "ResetButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={
              !(idProp || userInfoModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
