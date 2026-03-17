import { ReimbursementRequest } from '@/types'

export function PrintTemplate({ formData }: { formData: Partial<ReimbursementRequest> }) {
  const reqUser = formData.requesterDetails || {}
  const expenses = formData.expenses || []
  const totalEuros = expenses.reduce((sum, e) => sum + (e.amountEuros || 0), 0)

  return (
    <div className="hidden print:block w-full text-black bg-white font-sans text-sm p-4">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col items-center border border-black p-2 w-64 text-center">
          <div className="font-bold text-xl tracking-widest mb-1 flex items-center gap-1">
            <span className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs">
              C
            </span>
            <span>KAICIID</span>
          </div>
          <div className="text-xs font-semibold">Dialogue Centre</div>
          <div className="text-[10px] mt-1 border-t border-black pt-1 w-full">
            Av Jose Malhoa 19, 4th Floor 1070-157 Lisbon - Portugal
          </div>
        </div>

        <div className="border-2 border-dotted border-black px-6 py-2">
          <h1 className="text-2xl font-bold uppercase tracking-wider">Reimbursement Form</h1>
        </div>

        <div className="border border-dotted border-black p-2 w-64 text-xs">
          <div className="font-bold mb-1">Point of Contact:</div>
          <div>Finance Department</div>
          <div>finance@kaiciid.org</div>
        </div>
      </div>

      {/* Top Info Grid */}
      <table className="w-full border-collapse border border-black mb-6 text-xs">
        <tbody>
          <tr>
            <td className="border border-black bg-gray-200 p-1 w-32 font-bold text-gray-700 dotted-bg">
              Name
            </td>
            <td colSpan={3} className="border border-black p-1 font-semibold uppercase">
              {reqUser.name}
            </td>
          </tr>
          <tr>
            <td className="border border-black bg-gray-200 p-1 font-bold text-gray-700 dotted-bg">
              Company Name
            </td>
            <td colSpan={3} className="border border-black p-1 uppercase">
              {reqUser.organization}
            </td>
          </tr>
          <tr>
            <td className="border border-black bg-gray-200 p-1 font-bold text-gray-700 dotted-bg">
              Street Address
            </td>
            <td colSpan={3} className="border border-black p-1 uppercase">
              {reqUser.address}
            </td>
          </tr>
          <tr>
            <td className="border border-black bg-gray-200 p-1 font-bold text-gray-700 dotted-bg">
              City, ST ZIP Code
            </td>
            <td className="border border-black p-1 uppercase">
              {reqUser.city}, {reqUser.zipCode}
            </td>
            <td className="border border-black bg-gray-200 p-1 w-16 font-bold text-gray-700 dotted-bg">
              Phone
            </td>
            <td className="border border-black p-1 uppercase">{reqUser.phone}</td>
          </tr>
        </tbody>
      </table>

      {/* Expenses Table */}
      <table className="w-full border-collapse border border-black mb-6 text-xs text-center">
        <thead>
          <tr>
            <th className="border border-black bg-gray-200 p-1 w-8" rowSpan={2}>
              No.
            </th>
            <th className="border border-black bg-gray-200 p-1 text-left" rowSpan={2}>
              Description
            </th>
            <th className="border border-black bg-gray-200 p-1 w-20" rowSpan={2}>
              Amount
            </th>
            <th className="border border-black bg-gray-200 p-1 w-16" rowSpan={2}>
              Currency
            </th>
            <th className="border border-black bg-gray-200 p-1" colSpan={4}>
              To be filled only by KAICIID
            </th>
          </tr>
          <tr>
            <th className="border border-black bg-gray-200 p-1 w-20">Account</th>
            <th className="border border-black bg-gray-200 p-1 w-24">Budget line</th>
            <th className="border border-black bg-gray-200 p-1 w-16 text-[10px]">Exchange Rate</th>
            <th className="border border-black bg-gray-200 p-1 w-24 text-[10px]">Amount in EUR</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp, i) => (
            <tr key={i}>
              <td className="border border-black p-1">{i + 1}</td>
              <td className="border border-black p-1 text-left uppercase">{exp.description}</td>
              <td className="border border-black p-1">{exp.amount}</td>
              <td className="border border-black p-1 uppercase">{exp.currency}</td>
              <td className="border border-black p-1 bg-gray-100">
                {exp.account || formData.account}
              </td>
              <td className="border border-black p-1 bg-gray-100">
                {exp.workorder || formData.workorder}
              </td>
              <td className="border border-black p-1 bg-gray-100">
                {exp.exchangeRate?.toFixed(2)}
              </td>
              <td className="border border-black p-1 bg-gray-100">{exp.amountEuros?.toFixed(2)}</td>
            </tr>
          ))}
          {/* Empty rows filler */}
          {Array.from({ length: Math.max(0, 8 - expenses.length) }).map((_, i) => (
            <tr key={`empty-${i}`}>
              <td className="border border-black p-3">&nbsp;</td>
              <td className="border border-black p-3"></td>
              <td className="border border-black p-3"></td>
              <td className="border border-black p-3"></td>
              <td className="border border-black p-3 bg-gray-100"></td>
              <td className="border border-black p-3 bg-gray-100"></td>
              <td className="border border-black p-3 bg-gray-100"></td>
              <td className="border border-black p-3 bg-gray-100"></td>
            </tr>
          ))}
          <tr>
            <td colSpan={7} className="border border-black p-1 text-right font-bold bg-white">
              TOTAL
            </td>
            <td className="border border-black p-1 bg-gray-200 font-bold">
              {totalEuros.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="flex gap-4 items-start text-xs">
        {/* Bank Info */}
        <table className="flex-1 border-collapse border border-black">
          <thead>
            <tr>
              <th
                colSpan={2}
                className="border border-black bg-gray-200 p-1 italic text-center font-normal"
              >
                Bank transfer info (if applicable):
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black bg-gray-200 p-1 w-32 font-bold">Holder</td>
              <td className="border border-black p-1 uppercase">{reqUser.bankHolder}</td>
            </tr>
            <tr>
              <td className="border border-black bg-gray-200 p-1 font-bold">Bank name</td>
              <td className="border border-black p-1 uppercase">{reqUser.bankName}</td>
            </tr>
            <tr>
              <td className="border border-black bg-gray-200 p-1 font-bold">Account No/IBAN</td>
              <td className="border border-black p-1 uppercase">
                {reqUser.iban || reqUser.bankAccount}
              </td>
            </tr>
            <tr>
              <td className="border border-black bg-gray-200 p-1 font-bold">SWIFT/BIC</td>
              <td className="border border-black p-1 uppercase">{reqUser.swift || reqUser.bic}</td>
            </tr>
            <tr>
              <td className="border border-black bg-gray-200 p-1 font-bold">Bank Code</td>
              <td className="border border-black p-1 uppercase">{reqUser.bankCode}</td>
            </tr>
          </tbody>
        </table>

        {/* Signatures */}
        <table className="w-80 border-collapse border border-black">
          <tbody>
            <tr>
              <td className="border border-black p-1 h-12 align-top text-[10px]">
                Completed by:
                <br />
                <span className="text-sm font-serif italic ml-2">{formData.qcSignature?.name}</span>
              </td>
              <td className="border border-black p-1 w-24 align-top text-[10px]">
                Date:
                <br />
                <span className="text-xs ml-1">
                  {formData.qcSignature
                    ? new Date(formData.qcSignature.date).toLocaleDateString()
                    : ''}
                </span>
              </td>
            </tr>
            <tr>
              <td className="border border-black p-1 h-12 align-top text-[10px]">
                Certified by:
                <br />
                <span className="text-sm font-serif italic ml-2">{formData.coSignature?.name}</span>
              </td>
              <td className="border border-black p-1 align-top text-[10px]">
                Date:
                <br />
                <span className="text-xs ml-1">
                  {formData.coSignature
                    ? new Date(formData.coSignature.date).toLocaleDateString()
                    : ''}
                </span>
              </td>
            </tr>
            <tr>
              <td className="border border-black p-1 h-12 align-top text-[10px]">
                Received by (Name in block):
                <br />
                <span className="text-sm uppercase font-bold ml-2">
                  {formData.financeSignature?.name}
                </span>
              </td>
              <td className="border border-black p-1 align-top text-[10px]">
                Date:
                <br />
                <span className="text-xs ml-1">
                  {formData.financeSignature
                    ? new Date(formData.financeSignature.date).toLocaleDateString()
                    : ''}
                </span>
              </td>
            </tr>
            <tr>
              <td colSpan={2} className="border border-black p-1 h-16 align-top text-[10px]">
                Signature:
                <br />
                <div className="text-center font-serif text-xl italic mt-1">
                  {formData.signature || reqUser.name}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="text-right text-[8px] italic text-gray-500 mt-4">
        Last review July/2023 v3
      </div>
    </div>
  )
}
