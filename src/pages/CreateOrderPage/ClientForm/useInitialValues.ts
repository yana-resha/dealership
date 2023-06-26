import { useMemo } from 'react'

import { AddressType, PhoneType, ApplicantDocsType } from '@sberauto/loanapplifecycledc-proto/public'
import compact from 'lodash/compact'
import { DateTime } from 'luxon'

import { useGetFullApplicationQuery } from 'shared/api/requests/loanAppLifeCycleDc'
import { ApplicationFrontDc } from 'shared/api/requests/loanAppLifeCycleDc.mock'
import { useAppSelector } from 'shared/hooks/store/useAppSelector'
import { formatPassport } from 'shared/lib/utils'
import { getFullName } from 'shared/utils/clientNameTransform'

import { configAddressInitialValues } from './config/clientFormInitialValues'
import { addressTransformForForm } from './utils/addressTransformForRequest'
import { makeClientForm } from './utils/makeClienForm'

export function useInitialValues<D extends boolean | undefined>(applicationId?: string) {
  const initialValues = useAppSelector(state => makeClientForm(state.order.order))
  const { data: fullApplicationData, isLoading } = useGetFullApplicationQuery(
    { applicationId },
    { enabled: !!applicationId },
  )

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
          const preparedAddress = addressTransformForForm(cur, configAddressInitialValues)
          const preparedAddressString = compact(Object.values(preparedAddress)).join(', ')

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

  return {
    isShouldShowLoading: applicationId && isLoading,
    initialValues: {
      ...initialValues,
      ...(applicationId
        ? {
            clientName:
              getFullName(applicant?.firstName, applicant?.lastName, applicant?.middleName) ||
              initialValues.clientName,
            hasNameChanged: !!clientFormerName,
            clientFormerName: clientFormerName || initialValues.clientFormerName,
            numOfChildren: `${applicant?.children ?? initialValues.numOfChildren}`,
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
