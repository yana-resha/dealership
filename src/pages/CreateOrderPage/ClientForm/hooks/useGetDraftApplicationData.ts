import { useCallback } from 'react'

import { ApplicationFrontdc } from '@sberauto/loanapplifecycledc-proto/public'
import compact from 'lodash/compact'
import { DateTime, Interval } from 'luxon'

import { ApplicationTypes } from 'entities/application/application.utils'
import { getPointOfSaleFromCookies } from 'entities/pointOfSale'
import { useGetUserQuery } from 'entities/user'
import { useAppSelector } from 'shared/hooks/store/useAppSelector'
import { getFullName } from 'shared/utils/clientNameTransform'
import { getSplitedName } from 'shared/utils/clientNameTransform'
import { convertedDateToString } from 'shared/utils/dateTransform'
import { stringToNumber } from 'shared/utils/stringToNumber'

import { ClientData } from '../ClientForm.types'
import { PhoneType } from '../config/clientForm.values'
import { addressTransformForRequest } from '../utils/addressTransformForRequest'
import { transformDocsForRequest } from '../utils/transformDocsForRequest'
import { transformPhoneForRequest } from '../utils/transformPhoneForRequest'

export const useGetDraftApplicationData = () => {
  const { data: user } = useGetUserQuery()
  const { vendorCode } = getPointOfSaleFromCookies()
  const initialOrder = useAppSelector(state => state.order.order)
  const loanCar = initialOrder?.orderData?.loanCar

  return useCallback(
    (values: ClientData): ApplicationFrontdc => {
      const {
        birthDate: rawBirthDate,
        birthPlace,
        clientFormerName,
        clientName,
        specialMarkReason,
        email,
        numOfChildren,
        relatedToPublic,
        familyStatus,
        registrationAddress,
        livingAddress,
        additionalNumber,
        mobileNumber,
        incomeConfirmation,
        averageIncome,
        additionalIncome,
        familyIncome,
        expenses,
        secondDocumentType,
        secondDocumentNumber,
        secondDocumentDate,
        secondDocumentIssuedBy,
        occupation,
        employmentDate,
        employerName,
        employerInn,
        employerPhone,
      } = values

      const { isCarNew, autoCreateYear, mileage, brand, model, autoPrice } = loanCar ?? {}

      const {
        firstName: clientFirstName,
        lastName: clientLastName,
        middleName: clientMiddleName,
      } = getSplitedName(clientName)
      const {
        firstName: previosClientFirstName,
        lastName: previosClientLastName,
        middleName: previosClientMiddleName,
      } = getSplitedName(clientFormerName)

      return {
        //номер заявки если был уже созданный черновик из getFullApplication
        // dcAppId: string,  //добавить при интеграции экранов DCB-363
        appType: ApplicationTypes.initial,
        vendor: {
          vendorCode,
        },
        employees: {
          tabNumActual: user?.employeeId,
          fullNameActual: getFullName(user?.firstName, user?.lastName),
        },
        specialMark: specialMarkReason,
        // unit: string, //добавить после расширения ручки getVendorOptions DCB-389
        applicant: {
          type: 'MainDebitor',
          category: '0',
          lastName: clientLastName,
          firstName: clientFirstName,
          middleName: clientMiddleName,
          prevLastName: previosClientLastName,
          prevFirstName: previosClientFirstName,
          prevMiddleName: previosClientMiddleName,
          birthDate: convertedDateToString(rawBirthDate),
          birthPlace,
          //   sex: string, //добавить когда появится в анкете
          email,
          marital: familyStatus ?? undefined,
          children: numOfChildren ? parseInt(numOfChildren, 10) : 0,
          publicPerson: !!relatedToPublic,
          addresses: compact([
            registrationAddress ? addressTransformForRequest(registrationAddress) : undefined,
            livingAddress ? addressTransformForRequest(livingAddress) : undefined,
          ]),
          phones: compact([
            mobileNumber ? transformPhoneForRequest(mobileNumber, PhoneType.mob) : undefined,
            additionalNumber ? transformPhoneForRequest(additionalNumber, PhoneType.additional) : undefined,
            employerPhone ? transformPhoneForRequest(employerPhone, PhoneType.work) : undefined,
          ]),
          income: {
            incomeVerify: incomeConfirmation,
            proofOfIncomePapersType: 1, //тип документа подтверждающего доход, взять из контрактов, когда там появится
            basicIncome: stringToNumber(averageIncome),
            addIncome: stringToNumber(additionalIncome),
            // acceptedIncome: number,
            familyIncome: stringToNumber(familyIncome),
            expenses: stringToNumber(expenses),
          },
          documents: compact([
            !!secondDocumentType && !!secondDocumentNumber && !!secondDocumentDate && !!secondDocumentIssuedBy
              ? transformDocsForRequest(
                  secondDocumentType,
                  secondDocumentNumber,
                  secondDocumentDate,
                  secondDocumentIssuedBy,
                )
              : undefined,
          ]),
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
        },
        loanCar: {
          isCarNew,
          autoCreateYear,
          mileage: mileage ? `${mileage}` : undefined,
          brand,
          model,
          autoPrice,
        },
        //Пока не делаем будет переделываться на беке
        // loanData: {
        //   productFamilyCode: string,
        //   productId: string,
        //   productCode: number,
        //   productName: string,
        //   downPayment: number,
        //   dateStart: string,
        //   dateEnd: string,
        //   term: number,
        //   monthlyPayment: number,
        //   crMinValue: number,
        //   crMaxValue: number,
        //   productMinDuration: number,
        //   productMaxDuration: number,
        //   npllzp: number,
        //   npllzak: number,
        //   approvalValidity: number,
        //   cascoFlag: boolean, //признак продукта
        //   termsLoanCode: number, //из продукта
        //   incomeFlag: boolean, //из продукта
        //   creditAmount: number, //полная
        //   creditAmountWithoutAdd: number, //без допов
        //   productRates: ProductRatesFrontdc | null, //из продукта
        //   additionalOptions: AdditionalOptionFrontdc[] | null, //доп услуги из калькулятора
        // },
      }
    },
    [user, vendorCode, loanCar],
  )
}
