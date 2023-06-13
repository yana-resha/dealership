import { useCallback } from 'react'

import { Box, Button } from '@mui/material'
import { Form, Formik, useFormikContext } from 'formik'

import { maskCyrillicAndDigits } from 'shared/masks/InputMasks'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'
import { ModalDialog } from 'shared/ui/ModalDialog/ModalDialog'
import { SelectInputFormik } from 'shared/ui/SelectInput/SelectInputFormik'

import { Address } from '../../ClientForm.types'
import { clientAddressValidationSchema } from '../../config/clientFormValidation'
import { AREA_TYPES, CITY_TYPES, SETTLEMENT_TYPES, STREET_TYPES } from './AddressDialog.config'
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

  const { setFieldValue } = useFormikContext()

  const getStringIfPresent = useCallback((value: string) => (value ? value + ' ' : ''), [])

  const buildAddressString = useCallback(
    (values: Address) => {
      function getLabel(
        values: {
          value: string
          label: string
        }[],
        value?: string,
      ): string {
        if (!value) {
          return ''
        }

        return values.find(item => item.value === value)?.label ?? value ?? ''
      }

      return (
        getStringIfPresent(values.region) +
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
      ).trim()
    },
    [getStringIfPresent],
  )

  const onClose = useCallback(() => {
    setIsVisible(false)
    if (onCloseDialog) {
      onCloseDialog()
    }
  }, [onCloseDialog, setIsVisible])

  const onSubmit = useCallback(
    (values: Address) => {
      setFieldValue(addressName, values)
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
            <MaskedInputFormik name="region" label="Регион" placeholder="-" mask={maskCyrillicAndDigits} />

            <SelectInputFormik name="areaType" label="Тип района" placeholder="-" options={AREA_TYPES} />
            <MaskedInputFormik name="area" label="Район" placeholder="-" mask={maskCyrillicAndDigits} />

            <SelectInputFormik
              name="cityType"
              label="Тип города"
              placeholder="-"
              options={CITY_TYPES}
              emptyAvailable
            />
            <MaskedInputFormik name="city" label="Город" placeholder="-" mask={maskCyrillicAndDigits} />

            <SelectInputFormik
              name="settlementType"
              label="Тип населенного пункта"
              placeholder="-"
              options={SETTLEMENT_TYPES}
            />
            <MaskedInputFormik
              name="settlement"
              label="Населенный пункт"
              placeholder="-"
              mask={maskCyrillicAndDigits}
            />

            <SelectInputFormik name="streetType" label="Тип улицы" placeholder="-" options={STREET_TYPES} />
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
