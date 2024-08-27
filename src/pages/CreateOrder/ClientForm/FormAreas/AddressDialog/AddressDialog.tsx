import { useCallback } from 'react'

import { Box, Button } from '@mui/material'
import { Form, Formik, useFormikContext } from 'formik'

import { maskCyrillicAndDigits } from 'shared/masks/InputMasks'
import { AutocompleteInputFormik } from 'shared/ui/AutocompleteInput/AutocompleteInputFormik'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'
import { ModalDialog } from 'shared/ui/ModalDialog/ModalDialog'

import { Address, AddressTypeCode } from '../../ClientForm.types'
import { clientAddressValidationSchema } from '../../config/clientFormValidation'
import { useGetAddressMapQuery } from '../../hooks/useGetAddressMapQuery'
import { getAddressName } from '../../utils/addressMap'
import { useStyles } from './AddressDialog.styles'

type Props = {
  addressName: string
  address: Address
  label: string
  isVisible: boolean
  isDfoOnly?: boolean
  setIsVisible: (value: boolean) => void
  onCloseDialog?: () => void
}

export const AddressDialog = ({
  addressName,
  address,
  label,
  isVisible,
  isDfoOnly = false,
  setIsVisible,
  onCloseDialog,
}: Props) => {
  const classes = useStyles()
  const { data: addressMap = {} } = useGetAddressMapQuery()
  const { regionTypeCodes, areaTypeCodes, cityTypeCodes, settlementTypeCodes, streetTypeCodes } = addressMap
  const { setFieldValue } = useFormikContext<Address>()

  const getStringIfPresent = useCallback((value: string) => (value ? value + ' ' : ''), [])

  const getOptions = useCallback(
    (addressTypeCods: AddressTypeCode[] | undefined): string[] =>
      (addressTypeCods || []).map(addressTypeCod => addressTypeCod.code),
    [],
  )

  const buildAddressString = useCallback(
    (values: Address) =>
      (
        getStringIfPresent(values.regCode ?? '') +
        getStringIfPresent(getAddressName(regionTypeCodes, values.regCode)) +
        getStringIfPresent(getAddressName(areaTypeCodes, values.areaType)) +
        getStringIfPresent(values.area) +
        getStringIfPresent(getAddressName(cityTypeCodes, values.cityType)) +
        getStringIfPresent(values.city) +
        getStringIfPresent(getAddressName(settlementTypeCodes, values.settlementType)) +
        getStringIfPresent(values.settlement) +
        getStringIfPresent(getAddressName(streetTypeCodes, values.streetType)) +
        getStringIfPresent(values.street) +
        getStringIfPresent(values.house) +
        getStringIfPresent(values.unit) +
        getStringIfPresent(values.houseExt) +
        getStringIfPresent(values.unitNum)
      ).trim(),
    [areaTypeCodes, cityTypeCodes, getStringIfPresent, regionTypeCodes, settlementTypeCodes, streetTypeCodes],
  )

  const onClose = useCallback(() => {
    setIsVisible(false)
    if (onCloseDialog) {
      onCloseDialog()
    }
  }, [onCloseDialog, setIsVisible])

  const onSubmit = useCallback(
    (values: Address) => {
      setFieldValue(addressName, {
        ...values,
        region: getAddressName(addressMap.regionTypeCodes, values.regCode),
      })
      setFieldValue(`${addressName}String`, buildAddressString(values))
      setIsVisible(false)
    },
    [setFieldValue, addressName, addressMap.regionTypeCodes, buildAddressString, setIsVisible],
  )

  return (
    <ModalDialog isVisible={isVisible} label={label} onClose={onClose}>
      <Box className={classes.content}>
        <Formik
          initialValues={{
            ...address,
            validationParams: { isDfoOnly },
          }}
          validationSchema={clientAddressValidationSchema}
          onSubmit={onSubmit}
        >
          <Form className={classes.formContainer}>
            <AutocompleteInputFormik
              name="regCode"
              label="Регион"
              placeholder="-"
              options={getOptions(regionTypeCodes)}
              getOptionLabel={value => getAddressName(regionTypeCodes, value)}
            />

            <AutocompleteInputFormik
              name="areaType"
              label="Тип района"
              placeholder="-"
              options={getOptions(areaTypeCodes)}
              getOptionLabel={value => getAddressName(areaTypeCodes, value)}
            />
            <MaskedInputFormik name="area" label="Район" placeholder="-" mask={maskCyrillicAndDigits} />

            <AutocompleteInputFormik
              name="cityType"
              label="Тип города"
              placeholder="-"
              options={getOptions(cityTypeCodes)}
              getOptionLabel={value => getAddressName(cityTypeCodes, value)}
            />
            <MaskedInputFormik name="city" label="Город" placeholder="-" mask={maskCyrillicAndDigits} />

            <AutocompleteInputFormik
              name="settlementType"
              label="Тип населенного пункта"
              placeholder="-"
              options={getOptions(settlementTypeCodes)}
              getOptionLabel={value => getAddressName(settlementTypeCodes, value)}
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
              options={getOptions(streetTypeCodes)}
              getOptionLabel={value => getAddressName(streetTypeCodes, value)}
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
