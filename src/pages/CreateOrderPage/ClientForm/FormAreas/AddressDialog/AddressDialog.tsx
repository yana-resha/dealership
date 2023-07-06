import { useCallback } from 'react'

import { Box, Button } from '@mui/material'
import { Form, Formik, useFormikContext } from 'formik'

import { maskCyrillicAndDigits } from 'shared/masks/InputMasks'
import { AutocompleteInputFormik } from 'shared/ui/AutocompleteInput/AutocompleteInputFormik'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'
import { ModalDialog } from 'shared/ui/ModalDialog/ModalDialog'

import { Address } from '../../ClientForm.types'
import { clientAddressValidationSchema } from '../../config/clientFormValidation'
import { AREA_TYPES, CITY_TYPES, REGION_CODE, SETTLEMENT_TYPES, STREET_TYPES } from './AddressDialog.config'
import { useStyles } from './AddressDialog.styles'

type Props = {
  addressName: string
  address: Address
  label: string
  isVisible: boolean
  setIsVisible: (value: boolean) => void
  onCloseDialog?: () => void
}

export const AddressDialog = (props: Props) => {
  const classes = useStyles()
  const { addressName, address, label, isVisible, setIsVisible, onCloseDialog } = props

  const { setFieldValue } = useFormikContext<Address>()

  const getStringIfPresent = useCallback((value: string) => (value ? value + ' ' : ''), [])

  const getLabel = useCallback(
    (
      values: {
        value: string
        label: string
      }[],
      value: string | null,
    ) => {
      if (!value) {
        return ''
      }

      return values.find(item => item.value === value)?.label ?? value ?? ''
    },
    [],
  )

  const getOptions = useCallback(
    (
      values: {
        value: string
        label: string
      }[],
    ): string[] => values.map(type => type.value),
    [],
  )

  const buildAddressString = useCallback(
    (values: Address) =>
      (
        getStringIfPresent(values.regCode ?? '') +
        getStringIfPresent(getLabel(REGION_CODE, values.regCode)) +
        getStringIfPresent(getLabel(AREA_TYPES, values.areaType)) +
        getStringIfPresent(values.area) +
        getStringIfPresent(getLabel(CITY_TYPES, values.cityType)) +
        getStringIfPresent(values.city) +
        getStringIfPresent(getLabel(SETTLEMENT_TYPES, values.settlementType)) +
        getStringIfPresent(values.settlement) +
        getStringIfPresent(getLabel(STREET_TYPES, values.streetType)) +
        getStringIfPresent(values.street) +
        getStringIfPresent(values.house) +
        getStringIfPresent(values.unit) +
        getStringIfPresent(values.houseExt) +
        getStringIfPresent(values.unitNum)
      ).trim(),
    [getLabel, getStringIfPresent],
  )

  const onClose = useCallback(() => {
    setIsVisible(false)
    if (onCloseDialog) {
      onCloseDialog()
    }
  }, [onCloseDialog, setIsVisible])

  const onSubmit = useCallback(
    (values: Address) => {
      setFieldValue(addressName, { ...values, region: getLabel(REGION_CODE, values.regCode) })
      setFieldValue(`${addressName}String`, buildAddressString(values))
      setIsVisible(false)
    },
    [setIsVisible, setFieldValue, addressName, buildAddressString],
  )

  return (
    <ModalDialog isVisible={isVisible} label={label} onClose={onClose}>
      <Box className={classes.content}>
        <Formik initialValues={address} validationSchema={clientAddressValidationSchema} onSubmit={onSubmit}>
          <Form className={classes.formContainer}>
            <AutocompleteInputFormik
              name="regCode"
              label="Регион"
              placeholder="-"
              options={getOptions(REGION_CODE)}
              getOptionLabel={value => getLabel(REGION_CODE, value)}
            />

            <AutocompleteInputFormik
              name="areaType"
              label="Тип района"
              placeholder="-"
              options={getOptions(AREA_TYPES)}
              getOptionLabel={value => getLabel(AREA_TYPES, value)}
            />
            <MaskedInputFormik name="area" label="Район" placeholder="-" mask={maskCyrillicAndDigits} />

            <AutocompleteInputFormik
              name="cityType"
              label="Тип города"
              placeholder="-"
              options={getOptions(CITY_TYPES)}
              getOptionLabel={value => getLabel(CITY_TYPES, value)}
            />
            <MaskedInputFormik name="city" label="Город" placeholder="-" mask={maskCyrillicAndDigits} />

            <AutocompleteInputFormik
              name="settlementType"
              label="Тип населенного пункта"
              placeholder="-"
              options={getOptions(SETTLEMENT_TYPES)}
              getOptionLabel={value => getLabel(SETTLEMENT_TYPES, value)}
            />
            <MaskedInputFormik
              name="settlement"
              label="Населенный пункт"
              placeholder="-"
              mask={maskCyrillicAndDigits}
            />

            <AutocompleteInputFormik
              name="streetType"
              label="Тип улицы"
              placeholder="-"
              options={getOptions(STREET_TYPES)}
              getOptionLabel={value => getLabel(STREET_TYPES, value)}
            />
            <MaskedInputFormik name="street" label="Улица" placeholder="-" mask={maskCyrillicAndDigits} />

            <MaskedInputFormik name="house" label="Дом" placeholder="-" mask={maskCyrillicAndDigits} />
            <MaskedInputFormik name="unit" label="Строение" placeholder="-" mask={maskCyrillicAndDigits} />
            <MaskedInputFormik name="houseExt" label="Корпус" placeholder="-" mask={maskCyrillicAndDigits} />
            <MaskedInputFormik
              name="unitNum"
              label="Квартира/офис"
              placeholder="-"
              mask={maskCyrillicAndDigits}
            />

            <Button type="submit" variant="contained">
              Сохранить
            </Button>
          </Form>
        </Formik>
      </Box>
    </ModalDialog>
  )
}
