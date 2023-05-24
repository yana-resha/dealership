import React, { useCallback } from 'react'

import { Box, Button } from '@mui/material'
import { Form, Formik, useFormikContext } from 'formik'

import { maskCyrillicAndDigits } from 'shared/masks/InputMasks'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'
import { ModalDialog } from 'shared/ui/ModalDialog/ModalDialog'

import { Address } from '../../ClientForm.types'
import { clientAddressValidationSchema } from '../../config/clientFormValidation'
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
    (values: Address) =>
      (
        getStringIfPresent(values.region) +
        getStringIfPresent(values.district) +
        getStringIfPresent(values.city) +
        getStringIfPresent(values.townType) +
        getStringIfPresent(values.town) +
        getStringIfPresent(values.streetType) +
        getStringIfPresent(values.street) +
        getStringIfPresent(values.house) +
        getStringIfPresent(values.building) +
        getStringIfPresent(values.block) +
        getStringIfPresent(values.flat)
      ).trim(),
    [],
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
            <MaskedInputFormik name="district" label="Район" placeholder="-" mask={maskCyrillicAndDigits} />
            <MaskedInputFormik name="city" label="Город" placeholder="-" mask={maskCyrillicAndDigits} />
            <MaskedInputFormik
              name="townType"
              label="Тип населенного пункта"
              placeholder="-"
              mask={maskCyrillicAndDigits}
            />
            <MaskedInputFormik
              name="town"
              label="Населенный пункт"
              placeholder="-"
              mask={maskCyrillicAndDigits}
            />
            <MaskedInputFormik
              name="streetType"
              label="Тип улицы"
              placeholder="-"
              mask={maskCyrillicAndDigits}
            />
            <MaskedInputFormik name="street" label="Улица" placeholder="-" mask={maskCyrillicAndDigits} />
            <MaskedInputFormik name="house" label="Дом" placeholder="-" mask={maskCyrillicAndDigits} />
            <MaskedInputFormik
              name="building"
              label="Строение"
              placeholder="-"
              mask={maskCyrillicAndDigits}
            />
            <MaskedInputFormik name="block" label="Корпус" placeholder="-" mask={maskCyrillicAndDigits} />
            <MaskedInputFormik
              name="flat"
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
