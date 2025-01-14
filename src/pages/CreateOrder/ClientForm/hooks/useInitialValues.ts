import { useCallback, useMemo } from 'react'

import {
  AddressType,
  ApplicantDocsType,
  ApplicantFrontdc,
  ApplicationFrontdc,
  PhoneType,
  DocumentType,
  VendorFrontdc,
  OccupationType,
} from '@sberauto/loanapplifecycledc-proto/public'
import compact from 'lodash/compact'
import { DateTime } from 'luxon'
import { useDispatch } from 'react-redux'

import { AnketaType } from 'entities/applications/application.utils'
import { selectCurrentGovernmentProgram, updateApplication } from 'entities/order'
import { getPointOfSaleFromCookies } from 'entities/pointOfSale'
import { DocumentUploadStatus } from 'features/ApplicationFileLoader'
import { useAppSelector } from 'shared/hooks/store/useAppSelector'
import { formatPassport } from 'shared/lib/utils'
import { getFullName } from 'shared/utils/clientNameTransform'
import { convertedDateToString } from 'shared/utils/dateTransform'
import { stringToNumber } from 'shared/utils/stringToNumber'

import { ClientData, SubmitAction, ValidationParams } from '../ClientForm.types'
import { configAddressInitialValues, UPLOADED_DOCUMENTS } from '../config/clientFormInitialValues'
import { getAddressName } from '../utils/addressMap'
import { addressTransformForForm, addressTransformForRequest } from '../utils/addressTransformForRequest'
import { getCurrentWorkExperience } from '../utils/getCurrentWorkExperience'
import { makeClientForm } from '../utils/makeClienForm'
import { transformDocsForRequest } from '../utils/transformDocsForRequest'
import { transformPhoneForRequest } from '../utils/transformPhoneForRequest'
import { useGetAddressMapQuery } from './useGetAddressMapQuery'

export function useInitialValues() {
  const dispatch = useDispatch()
  const { initialOrder, user } = useAppSelector(state => ({
    initialOrder: state.order.order,
    user: state.user.user,
  }))
  const currentGovernmentProgram = useAppSelector(selectCurrentGovernmentProgram)

  const { data: addressMap = {}, isLoading: isAddressMapLoading } = useGetAddressMapQuery()
  const { areaTypeCodes, cityTypeCodes, settlementTypeCodes, streetTypeCodes } = addressMap

  const pointOfSale = getPointOfSaleFromCookies()

  const initialValues = makeClientForm(initialOrder)

  const application = useMemo(
    () => initialOrder?.orderData?.application || ({} as ApplicationFrontdc),
    [initialOrder?.orderData?.application],
  )

  const { dcAppId, applicant, createdDate, scans, loanData } = useMemo(
    () => application || ({} as ApplicationFrontdc),
    [application],
  )

  const clientFormerLastName = applicant?.prevLastName
  const clientFormerFirstName = applicant?.prevFirstName
  const clientFormerMiddleName = applicant?.prevMiddleName

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
          const preparedAddress = addressTransformForForm(cur, configAddressInitialValues)
          const preparedAddressString =
            getStringIfPresent(preparedAddress.postalCode) +
            getStringIfPresent(preparedAddress.regCode ?? '') +
            getStringIfPresent(preparedAddress.region) +
            getStringIfPresent(getAddressName(areaTypeCodes, preparedAddress.areaType)) +
            getStringIfPresent(preparedAddress.area) +
            getStringIfPresent(getAddressName(cityTypeCodes, preparedAddress.cityType)) +
            getStringIfPresent(preparedAddress.city) +
            getStringIfPresent(getAddressName(settlementTypeCodes, preparedAddress.settlementType)) +
            getStringIfPresent(preparedAddress.settlement) +
            getStringIfPresent(getAddressName(streetTypeCodes, preparedAddress.streetType)) +
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
      areaTypeCodes,
      cityTypeCodes,
      getStringIfPresent,
      initialValues.employerAddressString,
      initialValues.livingAddressString,
      initialValues.registrationAddressString,
      settlementTypeCodes,
      streetTypeCodes,
    ],
  )

  const regAddrIsLivingAddr =
    registrationAddressString && livingAddressString
      ? registrationAddressString === livingAddressString
      : initialValues.regAddrIsLivingAddr

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

  const validationParams: ValidationParams = useMemo(
    () => ({
      applicationCreatedDate: createdDate ? new Date(createdDate) : undefined,
      minChildrenCount: stringToNumber(currentGovernmentProgram?.children) ?? 0,
      isDfoProgram: loanData?.govprogramDfoFlag ?? false,
    }),
    [createdDate, currentGovernmentProgram?.children, loanData?.govprogramDfoFlag],
  )

  const remapApplicationValues = useCallback(
    (values: ClientData): ApplicationFrontdc | undefined => {
      const {
        clientLastName,
        clientFirstName,
        clientMiddleName,
        clientFormerLastName,
        clientFormerFirstName,
        clientFormerMiddleName,
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
      if (!application) {
        return undefined
      }

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
        firstName: clientFirstName.trim(),
        lastName: clientLastName.trim(),
        middleName: clientMiddleName.trim(),
        prevFirstName: clientFormerFirstName.trim(),
        prevLastName: clientFormerLastName.trim(),
        prevMiddleName: clientFormerMiddleName.trim(),
        birthDate: convertedDateToString(birthDate),
        children: numOfChildren ? numOfChildren : undefined,
        marital: familyStatus ?? undefined,
        birthPlace: birthPlace,
        sex,
        email: email,
        publicPerson: relatedToPublic,
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
          // Если клиент не работает или персионер, то объект employerAddress не должен попадать на скоринг
          employerAddress &&
          occupation !== OccupationType.UNEMPLOYED &&
          occupation !== OccupationType.PENSIONER
            ? addressTransformForRequest(employerAddress, AddressType.WORKPLACE)
            : undefined,
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
            submitAction === SubmitAction.SAVE
              ? stringToNumber(additionalIncome) || 0
              : stringToNumber(additionalIncome),
          familyIncome: stringToNumber(familyIncome),
        },
        employment: {
          occupation: occupation ?? undefined,
          currentWorkExperience:
            employmentDate && newCreatedDate
              ? getCurrentWorkExperience(employmentDate, new Date(newCreatedDate))
              : undefined,
          orgName: employerName ?? undefined,
          inn: employerInn,
        },
      }

      const newVendor: VendorFrontdc = {
        ...application?.vendor,
        ...pointOfSale,
        unit: undefined,
      }

      const updatedApplication = {
        ...application,
        dcAppId: application?.dcAppId,
        unit: pointOfSale.unit,
        loanCar: preparedLoanCar,
        applicant: newApplicant,
        createdDate: newCreatedDate,
        employees: {
          fioActual: getFullName(user?.lastName, user?.firstName, user?.middleName),
          tabNumActual: user?.employeeId,
        },
        specialMark: application?.specialMark,
        vendor: newVendor,
      }

      return updatedApplication
    },
    [createdDate, dcAppId, application, pointOfSale, user],
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
    (application: ApplicationFrontdc) => dispatch(updateApplication(application)),
    [dispatch],
  )

  const saveValuesToStore = useCallback(
    (values: ClientData) => {
      const application = remapApplicationValues(values)
      if (!application) {
        return
      }
      updateOrderData(application)
    },
    [remapApplicationValues, updateOrderData],
  )

  const makeDocumentTypeFile = (expectedType: DocumentType) => {
    const currentScan = scans?.find(scan => scan.type === expectedType)

    if (!currentScan?.type || !dcAppId) {
      return null
    }

    return {
      file: { dcAppId, documentType: currentScan.type, name: currentScan.name },
      status: DocumentUploadStatus.Uploaded,
    }
  }

  const initialValuesClientData: ClientData = {
    ...initialValues,
    incomeConfirmation: loanData?.incomeProduct
      ? true
      : !!(applicant?.income?.incomeVerify ?? initialValues.incomeConfirmation),
    ...(applicant
      ? {
          // В данной группе основным значением идет initialValues,
          // т.к. пользователь может вернуться на первый шаг и поменять данные клиента,
          // потому всегда стараемся эти данные брать из первого шага, если он был
          clientLastName: applicant?.lastName || initialValues.clientLastName,
          clientFirstName: applicant?.firstName || initialValues.clientFirstName,
          clientMiddleName: applicant?.middleName || initialValues.clientMiddleName,
          birthDate: initialValues.birthDate || (applicant?.birthDate ? new Date(applicant.birthDate) : null),
          passport: initialValues.passport || formatPassport(passport.series, passport.number),
          mobileNumber: initialValues.mobileNumber || mobileNumber,
          // конец группы

          hasNameChanged: !!clientFormerLastName,
          clientFormerLastName: clientFormerLastName || initialValues.clientFormerLastName,
          clientFormerFirstName: clientFormerFirstName || initialValues.clientFormerFirstName,
          clientFormerMiddleName: clientFormerMiddleName || initialValues.clientFormerMiddleName,
          numOfChildren: applicant?.children ?? initialValues.numOfChildren,
          sex: applicant?.sex ?? initialValues.sex,
          familyStatus: applicant?.marital ?? initialValues.familyStatus,
          birthPlace: applicant?.birthPlace ?? initialValues.birthPlace,
          passportDate: passport.issuedDate ? new Date(passport.issuedDate) : initialValues.passportDate,
          divisionCode: passport.issuedCode ?? initialValues.divisionCode,
          issuedBy: passport.issuedBy ?? initialValues.issuedBy,
          registrationAddressString,
          registrationAddress,
          regAddrIsLivingAddr,
          livingAddressString,
          livingAddress,
          additionalNumber,
          email: applicant?.email ?? initialValues.email,
          averageIncome: `${applicant?.income?.basicIncome ?? initialValues.averageIncome}`,
          additionalIncome: `${applicant?.income?.addIncome ?? initialValues.additionalIncome}`,

          ndfl2File: makeDocumentTypeFile(DocumentType.TWO_NDFL),
          ndfl3File: makeDocumentTypeFile(DocumentType.TAX_DECLARATION),
          bankStatementFile: makeDocumentTypeFile(DocumentType.CERTIFICATE_FREE_FORM),

          familyIncome: `${applicant?.income?.familyIncome ?? initialValues.familyIncome}`,
          relatedToPublic: applicant?.publicPerson ?? initialValues.relatedToPublic,
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

    validationParams,
  }

  return {
    remapApplicationValues,
    setAnketaType,
    updateOrderData,
    saveValuesToStore,
    isShouldShowLoading: isAddressMapLoading,
    initialValues: initialValuesClientData,
    dcAppId,
  }
}
