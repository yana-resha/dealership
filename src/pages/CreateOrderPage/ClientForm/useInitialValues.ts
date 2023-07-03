import { useCallback, useMemo } from 'react'

import { AddressType, ApplicantDocsType, PhoneType } from '@sberauto/loanapplifecycledc-proto/public'
import compact from 'lodash/compact'
import { DateTime, Interval } from 'luxon'
import { useDispatch } from 'react-redux'

import { ApplicantFrontdc, ApplicationFrontDc } from 'shared/api/requests/loanAppLifeCycleDc.mock'
import { useAppSelector } from 'shared/hooks/store/useAppSelector'
import { formatPassport } from 'shared/lib/utils'
import { getFullName, getSplitedName } from 'shared/utils/clientNameTransform'
import { convertedDateToString } from 'shared/utils/dateTransform'
import { stringToNumber } from 'shared/utils/stringToNumber'

import { updateOrder } from '../model/orderSlice'
import { ClientData } from './ClientForm.types'
import { configAddressInitialValues } from './config/clientFormInitialValues'
import {
  AREA_TYPES,
  CITY_TYPES,
  SETTLEMENT_TYPES,
  STREET_TYPES,
} from './FormAreas/AddressDialog/AddressDialog.config'
import { addressTransformForForm, addressTransformForRequest } from './utils/addressTransformForRequest'
import { makeClientForm } from './utils/makeClienForm'
import { transformDocsForRequest } from './utils/transformDocsForRequest'
import { transformPhoneForRequest } from './utils/transformPhoneForRequest'

export function useInitialValues<D extends boolean | undefined>() {
  const initialValues = useAppSelector(state => makeClientForm(state.order.order))
  const initialOrder = useAppSelector(state => state.order.order)
  const dispatch = useDispatch()
  const fullApplicationData = initialOrder?.orderData

  const { applicant, specialMark, createdDate } = useMemo(
    () => fullApplicationData?.application || ({} as ApplicationFrontDc),
    [fullApplicationData?.application],
  )

  const clientFormerName = getFullName(
    applicant?.prevFirstName,
    applicant?.prevLastName,
    applicant?.prevMiddleName,
  )

  const { passport, secondDocument } = useMemo(() => {
    const passport = applicant?.documents?.find(d => d.type === ApplicantDocsType.PASSPORT) || {}
    const secondDocument = applicant?.documents?.find(d => d.type !== ApplicantDocsType.PASSPORT) || {}

    return { passport, secondDocument }
  }, [applicant?.documents])

  const getStringIfPresent = useCallback((value: string) => (value ? value + ' ' : ''), [])

  const {
    registrationAddress,
    registrationAddressString,
    livingAddress,
    livingAddressString,
    employerAddress,
    employerAddressString,
  } = useMemo(
    () =>
      (applicant?.addresses || []).reduce(
        (acc, cur) => {
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

          const preparedAddress = addressTransformForForm(cur, configAddressInitialValues)
          const preparedAddressString =
            getStringIfPresent(preparedAddress.region) +
            getStringIfPresent(getLabel(AREA_TYPES, preparedAddress.areaType)) +
            getStringIfPresent(preparedAddress.area) +
            getStringIfPresent(getLabel(CITY_TYPES, preparedAddress.cityType)) +
            getStringIfPresent(preparedAddress.city) +
            getStringIfPresent(getLabel(SETTLEMENT_TYPES, preparedAddress.settlementType)) +
            getStringIfPresent(preparedAddress.settlement) +
            getStringIfPresent(getLabel(STREET_TYPES, preparedAddress.streetType)) +
            getStringIfPresent(preparedAddress.street) +
            getStringIfPresent(preparedAddress.house) +
            getStringIfPresent(preparedAddress.unit) +
            getStringIfPresent(preparedAddress.houseExt) +
            getStringIfPresent(preparedAddress.unitNum)

          if (cur.type === AddressType.PERMANENT_REGISTRATION) {
            acc.registrationAddress = preparedAddress
            acc.registrationAddressString = preparedAddressString
          }
          if (cur.type === AddressType.ACTUAL_RESIDENCE) {
            acc.livingAddress = preparedAddress
            acc.livingAddressString = preparedAddressString
          }
          if (cur.type === AddressType.WORKPLACE) {
            acc.employerAddress = preparedAddress
            acc.employerAddressString = preparedAddressString
          }

          return acc
        },
        {
          registrationAddress: configAddressInitialValues,
          registrationAddressString: initialValues.registrationAddressString,
          livingAddress: configAddressInitialValues,
          livingAddressString: initialValues.livingAddressString,
          employerAddress: configAddressInitialValues,
          employerAddressString: initialValues.employerAddressString,
        },
      ),
    [
      applicant?.addresses,
      initialValues.employerAddressString,
      initialValues.livingAddressString,
      initialValues.registrationAddressString,
    ],
  )

  const regAddrIsLivingAddr =
    registrationAddressString && livingAddressString
      ? registrationAddressString === livingAddressString
      : initialValues.regAddrIsLivingAddr

  const relatedToPublic =
    typeof applicant?.publicPerson === 'boolean'
      ? applicant?.publicPerson
        ? 1
        : 0
      : initialValues.relatedToPublic

  const { mobileNumber, additionalNumber, employerPhone } = useMemo(
    () =>
      (applicant?.phones || []).reduce(
        (acc, cur) => {
          if (!cur.type || !cur.countryPrefix || !cur.prefix || !cur.number) {
            return acc
          }
          const phone = cur.countryPrefix + cur.prefix + cur.number

          if (cur.type === PhoneType.MOBILE) {
            acc.mobileNumber = phone
          }
          if (cur.type === PhoneType.ADDITIONAL) {
            acc.additionalNumber = phone
          }
          if (cur.type === PhoneType.WORKING) {
            acc.employerPhone = phone
          }

          return acc
        },
        {
          mobileNumber: initialValues.mobileNumber,
          additionalNumber: initialValues.additionalNumber,
          employerPhone: initialValues.employerPhone,
        },
      ),
    [
      applicant?.phones,
      initialValues.additionalNumber,
      initialValues.employerPhone,
      initialValues.mobileNumber,
    ],
  )

  const employmentDate = useMemo(
    () =>
      applicant?.employment?.currentWorkExperience !== undefined && !!createdDate
        ? DateTime.fromJSDate(new Date(createdDate))
            .minus({ months: applicant?.employment?.currentWorkExperience })
            .toJSDate()
        : initialValues.employmentDate,
    [applicant?.employment?.currentWorkExperience, createdDate, initialValues.employmentDate],
  )

  const remapApplicationValues = useCallback(
    (values: ClientData) => {
      const {
        clientName,
        clientFormerName,
        birthPlace,
        birthDate,
        issuedBy,
        secondDocumentIssuedBy,
        secondDocumentNumber,
        mobileNumber,
        additionalNumber,
        relatedToPublic,
        secondDocumentType,
        secondDocumentDate,
        employmentDate,
        employerName,
        employerInn,
        employerPhone,
        employerAddress,
        livingAddress,
        regAddrIsLivingAddr,
        registrationAddress,
        passportDate,
        passport,
        email,
        numOfChildren,
        additionalIncome,
        familyIncome,
        expenses,
        incomeConfirmation,
        averageIncome,
        familyStatus,
        occupation,
        divisionCode,
        specialMark,
      } = values

      const application = fullApplicationData?.application
      if (!application) {
        return
      }
      const {
        firstName: clientFirstName,
        lastName: clientLastName,
        middleName: clientMiddleName,
      } = getSplitedName(clientName)
      const {
        firstName: previousClientFirstName,
        lastName: previousClientLastName,
        middleName: previousClientMiddleName,
      } = getSplitedName(clientFormerName)
      const actualLivingAddress = regAddrIsLivingAddr ? registrationAddress : livingAddress

      const newApplicant: ApplicantFrontdc = {
        firstName: clientFirstName,
        lastName: clientLastName,
        middleName: clientMiddleName,
        prevFirstName: previousClientFirstName,
        prevLastName: previousClientLastName,
        prevMiddleName: previousClientMiddleName,
        birthDate: convertedDateToString(birthDate),
        children: numOfChildren ? parseInt(numOfChildren, 10) : undefined,
        marital: familyStatus ?? undefined,
        birthPlace: birthPlace,
        email: email,
        publicPerson: relatedToPublic === 1,
        documents: compact([
          {
            ...transformDocsForRequest(ApplicantDocsType.PASSPORT, passport, passportDate, issuedBy),
            issuedCode: divisionCode,
          },
          transformDocsForRequest(
            secondDocumentType,
            secondDocumentNumber,
            secondDocumentDate,
            secondDocumentIssuedBy,
          ),
        ]),
        addresses: compact([
          registrationAddress
            ? addressTransformForRequest(registrationAddress, AddressType.PERMANENT_REGISTRATION)
            : undefined,
          livingAddress
            ? addressTransformForRequest(actualLivingAddress, AddressType.ACTUAL_RESIDENCE)
            : undefined,
          employerAddress ? addressTransformForRequest(employerAddress, AddressType.WORKPLACE) : undefined,
        ]),
        phones: compact([
          mobileNumber ? transformPhoneForRequest(mobileNumber, PhoneType.MOBILE) : undefined,
          additionalNumber ? transformPhoneForRequest(additionalNumber, PhoneType.ADDITIONAL) : undefined,
          employerPhone ? transformPhoneForRequest(employerPhone, PhoneType.WORKING) : undefined,
        ]),
        income: {
          incomeVerify: incomeConfirmation,
          basicIncome: stringToNumber(averageIncome),
          addIncome: stringToNumber(additionalIncome),
          familyIncome: stringToNumber(familyIncome),
          expenses: stringToNumber(expenses),
        },
        employment: {
          occupation: occupation ?? undefined,
          currentWorkExperience: employmentDate
            ? parseInt(
                Interval.fromDateTimes(DateTime.fromJSDate(employmentDate), DateTime.now())
                  .toDuration(['months'])
                  .toFormat('MM'),
                10,
              )
            : undefined,
          orgName: employerName,
          inn: employerInn,
        },
      }

      const updatedApplication = {
        ...application,
        applicant: newApplicant,
        specialMark: specialMark,
        createdDate: convertedDateToString(new Date()),
      }

      dispatch(updateOrder({ orderData: { ...fullApplicationData, application: updatedApplication } }))
    },
    [fullApplicationData],
  )

  return {
    remapApplicationValues,
    isShouldShowLoading: false,
    initialValues: {
      ...initialValues,
      ...(fullApplicationData?.application?.applicant
        ? {
            clientName:
              getFullName(applicant?.firstName, applicant?.lastName, applicant?.middleName) ||
              initialValues.clientName,
            hasNameChanged: !!clientFormerName,
            clientFormerName: clientFormerName || initialValues.clientFormerName,
            numOfChildren: `${applicant?.children ?? initialValues.numOfChildren}`,
            sex: applicant?.sex ?? initialValues.sex,
            familyStatus: applicant?.marital ?? initialValues.familyStatus,
            birthDate: applicant?.birthDate ? new Date(applicant.birthDate) : initialValues.birthDate,
            birthPlace: applicant?.birthPlace ?? initialValues.birthPlace,
            passport: formatPassport(passport.series, passport.number),
            passportDate: passport.issuedDate ? new Date(passport.issuedDate) : initialValues.passportDate,
            divisionCode: passport.issuedCode ?? initialValues.divisionCode,
            issuedBy: passport.issuedBy ?? initialValues.issuedBy,
            registrationAddressString,
            registrationAddress,
            regAddrIsLivingAddr,
            livingAddressString,
            livingAddress,
            mobileNumber,
            additionalNumber,
            email: applicant?.email ?? initialValues.email,
            averageIncome: `${applicant?.income?.basicIncome ?? initialValues.averageIncome}`,
            additionalIncome: `${applicant?.income?.addIncome ?? initialValues.additionalIncome}`,
            incomeConfirmation: !!(applicant?.income?.incomeVerify ?? initialValues.incomeConfirmation),
            familyIncome: `${applicant?.income?.familyIncome ?? initialValues.familyIncome}`,
            expenses: `${applicant?.income?.expenses ?? initialValues.expenses}`,
            relatedToPublic: relatedToPublic,
            secondDocumentType: secondDocument.type ?? initialValues.secondDocumentType,
            secondDocumentNumber:
              (secondDocument.series || '') + (secondDocument.number || '') ||
              initialValues.secondDocumentNumber,
            secondDocumentDate: secondDocument.issuedDate
              ? new Date(secondDocument.issuedDate)
              : initialValues.passportDate,
            secondDocumentIssuedBy: secondDocument.issuedBy ?? initialValues.secondDocumentIssuedBy,
            occupation: applicant?.employment?.occupation ?? initialValues.occupation,
            employmentDate,
            employerName: applicant?.employment?.orgName ?? initialValues.employerName,
            employerPhone,
            employerAddress,
            employerAddressString,
            employerInn: applicant?.employment?.inn ?? initialValues.employerInn,
            specialMark: specialMark ?? initialValues.specialMark,
          }
        : {}),
    },
  }
}
