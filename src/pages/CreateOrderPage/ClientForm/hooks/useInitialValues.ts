import { useCallback, useMemo } from 'react'

import {
  AddressType,
  ApplicantDocsType,
  ApplicantFrontdc,
  ApplicationFrontdc,
  PhoneType,
  DocumentType,
  VendorFrontdc,
} from '@sberauto/loanapplifecycledc-proto/public'
import compact from 'lodash/compact'
import { DateTime, Interval } from 'luxon'
import { useDispatch } from 'react-redux'

import { AnketaType } from 'entities/application/application.utils'
import { getPointOfSaleFromCookies } from 'entities/pointOfSale'
import { updateOrder } from 'entities/reduxStore/orderSlice'
import { DocumentUploadStatus } from 'features/ApplicationFileLoader'
import { useGetUserQuery } from 'shared/api/requests/authdc'
import { useAppSelector } from 'shared/hooks/store/useAppSelector'
import { formatPassport } from 'shared/lib/utils'
import { getFullName, getSplitedName } from 'shared/utils/clientNameTransform'
import { convertedDateToString } from 'shared/utils/dateTransform'
import { stringToNumber } from 'shared/utils/stringToNumber'

import { ClientData, SubmitAction } from '../ClientForm.types'
import { AREA_TYPES, CITY_TYPES, SETTLEMENT_TYPES, STREET_TYPES } from '../config/address.config'
import { configAddressInitialValues, UPLOADED_DOCUMENTS } from '../config/clientFormInitialValues'
import { addressTransformForForm, addressTransformForRequest } from '../utils/addressTransformForRequest'
import { makeClientForm } from '../utils/makeClienForm'
import { transformDocsForRequest } from '../utils/transformDocsForRequest'
import { transformPhoneForRequest } from '../utils/transformPhoneForRequest'

export function useInitialValues() {
  const dispatch = useDispatch()
  const initialOrder = useAppSelector(state => state.order.order)

  const { data: user } = useGetUserQuery()
  const pointOfSale = getPointOfSaleFromCookies()

  const initialValues = makeClientForm(initialOrder)

  const fullApplicationData = initialOrder?.orderData

  const { dcAppId, applicant, createdDate } = useMemo(
    () => fullApplicationData?.application || ({} as ApplicationFrontdc),
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
            value?: string | null,
          ): string {
            if (!value) {
              return ''
            }

            return values.find(item => item.value === value)?.label ?? value ?? ''
          }

          const preparedAddress = addressTransformForForm(cur, configAddressInitialValues)
          const preparedAddressString =
            getStringIfPresent(preparedAddress.postalCode) +
            getStringIfPresent(preparedAddress.regCode ?? '') +
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
      getStringIfPresent,
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
  const employmentDate = useMemo(() => {
    try {
      return applicant?.employment?.currentWorkExperience !== undefined && !!createdDate
        ? DateTime.fromJSDate(new Date(createdDate))
            .minus({ months: applicant?.employment?.currentWorkExperience })
            .toJSDate()
        : initialValues.employmentDate
    } catch (e) {
      return initialValues.employmentDate
    }
  }, [applicant?.employment?.currentWorkExperience, createdDate, initialValues.employmentDate])

  const remapApplicationValues = useCallback(
    (values: ClientData): ApplicationFrontdc | undefined => {
      const {
        clientName,
        clientFormerName,
        birthPlace,
        birthDate,
        issuedBy,
        secondDocumentIssuedBy,
        secondDocumentIssuedCode,
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
        ndfl2File,
        ndfl3File,
        bankStatementFile,
        averageIncome,
        familyStatus,
        occupation,
        divisionCode,
        sex,
        submitAction,
      } = values
      const application = fullApplicationData?.application
      if (!application) {
        return undefined
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

      // Форматируем значения для loanCar
      const preparedLoanCar = application?.loanCar ? { ...application.loanCar } : undefined
      if (preparedLoanCar && preparedLoanCar.mileage === '') {
        // mileage не должен быть пустой строкой
        preparedLoanCar.mileage = '0'
      }

      let incomeDocumentType: null | DocumentType = null
      if (bankStatementFile) {
        incomeDocumentType = UPLOADED_DOCUMENTS['bankStatementFile'].documentType
      }
      if (ndfl2File) {
        incomeDocumentType = UPLOADED_DOCUMENTS['ndfl2File'].documentType
      }
      if (ndfl3File) {
        incomeDocumentType = UPLOADED_DOCUMENTS['ndfl3File'].documentType
      }

      const newCreatedDate = dcAppId ? createdDate : convertedDateToString(new Date())

      const newApplicant: ApplicantFrontdc = {
        firstName: clientFirstName,
        lastName: clientLastName,
        middleName: clientMiddleName,
        prevFirstName: previousClientFirstName,
        prevLastName: previousClientLastName,
        prevMiddleName: previousClientMiddleName,
        birthDate: convertedDateToString(birthDate),
        children: numOfChildren ? numOfChildren : undefined,
        marital: familyStatus ?? undefined,
        birthPlace: birthPlace,
        sex,
        email: email,
        publicPerson: relatedToPublic === 1,
        documents: compact([
          {
            ...transformDocsForRequest(
              ApplicantDocsType.PASSPORT,
              passport,
              passportDate,
              issuedBy,
              divisionCode,
            ),
          },
          transformDocsForRequest(
            secondDocumentType,
            secondDocumentNumber,
            secondDocumentDate,
            secondDocumentIssuedBy,
            secondDocumentIssuedCode,
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
          incomeDocumentType: incomeConfirmation
            ? (incomeDocumentType as unknown as DocumentType)
            : undefined,
          basicIncome: stringToNumber(averageIncome),
          // свойство addIncome должно быть обязательно number, даже если пользователь не заполнил его,
          // но только в случае отправки заявки, а не сохранения черновика
          addIncome:
            submitAction === SubmitAction.Save
              ? stringToNumber(additionalIncome) || 0
              : stringToNumber(additionalIncome),
          familyIncome: stringToNumber(familyIncome),
          expenses: stringToNumber(expenses),
        },
        employment: {
          occupation: occupation ?? undefined,
          currentWorkExperience:
            employmentDate && newCreatedDate
              ? parseInt(
                  Interval.fromDateTimes(
                    DateTime.fromJSDate(employmentDate),
                    DateTime.fromISO(newCreatedDate),
                  )
                    .toDuration(['months'])
                    .toFormat('MM'),
                  10,
                )
              : undefined,
          orgName: employerName ?? undefined,
          inn: employerInn,
        },
      }

      const newVendor: VendorFrontdc = {
        ...application?.vendor,
        ...pointOfSale,
      }

      const updatedApplication = {
        ...application,
        dcAppId: application?.dcAppId,
        unit: pointOfSale.unit,
        loanCar: preparedLoanCar,
        applicant: newApplicant,
        createdDate: newCreatedDate,
        employees: {
          tabNumActual: user?.employeeId,
          fullNameCreated: getFullName(user?.firstName, user?.lastName),
        },
        specialMark: application?.specialMark,
        vendor: newVendor,
      }

      return updatedApplication
    },
    [
      createdDate,
      dcAppId,
      fullApplicationData,
      pointOfSale,
      user?.employeeId,
      user?.firstName,
      user?.lastName,
    ],
  )

  const setAnketaType = useCallback(
    (application: ApplicationFrontdc, isFormValid: boolean) => ({
      ...application,
      anketaType:
        application?.anketaType === AnketaType.Full
          ? AnketaType.Full
          : isFormValid
          ? AnketaType.Complete
          : AnketaType.Incomplete,
    }),
    [],
  )
  /* Обновление заявке в стор вынесено из remapApplicationValues отдельно, т.к. должно применяться
  только при сохранении заявки, которое можно отменить, а remapApplicationValues вызывается раньше */
  const updateOrderData = useCallback(
    (application: ApplicationFrontdc) =>
      dispatch(updateOrder({ orderData: { ...fullApplicationData, application } })),
    [dispatch, fullApplicationData],
  )

  const makeDocumentTypeFile = (expectedType: DocumentType) => {
    const currentScan = fullApplicationData?.application?.scans?.find(scan => scan.type === expectedType)

    if (!currentScan?.type || !dcAppId) {
      return undefined
    }

    return {
      file: { dcAppId, documentType: currentScan.type, name: currentScan.name },
      status: DocumentUploadStatus.Uploaded,
    }
  }

  const initialValuesClientData: ClientData = {
    ...initialValues,
    ...(fullApplicationData?.application?.applicant
      ? {
          clientName:
            getFullName(applicant?.firstName, applicant?.lastName, applicant?.middleName) ||
            initialValues.clientName,
          hasNameChanged: !!clientFormerName,
          clientFormerName: clientFormerName || initialValues.clientFormerName,
          numOfChildren: applicant?.children ?? initialValues.numOfChildren,
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
          ndfl2File: makeDocumentTypeFile(DocumentType.TWO_NDFL),
          ndfl3File: makeDocumentTypeFile(DocumentType.TAX_DECLARATION),
          bankStatementFile: makeDocumentTypeFile(DocumentType.CERTIFICATE_FREE_FORM),

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
          secondDocumentIssuedCode: secondDocument.issuedCode ?? initialValues.secondDocumentIssuedCode,
          occupation: applicant?.employment?.occupation ?? initialValues.occupation,
          employmentDate,
          employerName: applicant?.employment?.orgName ?? initialValues.employerName,
          employerPhone,
          employerAddress,
          employerAddressString,
          employerInn: applicant?.employment?.inn ?? initialValues.employerInn,
          questionnaireFile: makeDocumentTypeFile(DocumentType.CONSENT_FORM),
        }
      : {}),
  }

  return {
    remapApplicationValues,
    setAnketaType,
    updateOrderData,
    isShouldShowLoading: false,
    initialValues: initialValuesClientData,
    dcAppId,
  }
}
