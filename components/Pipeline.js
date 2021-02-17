function MergeSourcesHorizontal() {
  return (
    <pre className="font-mono text-pink-600 text-xl">
      {`----------->      
-------------->   
--- `}
      <span className="text-pink-600 font-semibold">CLEAN</span>
      {` ------> 
--- `}
      <span className="text-pink-600 font-semibold">AGGREGATE</span>
      {` --->
--- `}
      <span className="text-pink-600 font-semibold">ANALYSE</span>
      {` ----> 
-------------->   
----------->      `}
    </pre>
  )
}

function APIPipeHorizontal() {
  return (
    <pre className="font-mono text-pink-600 text-xl">
      {`  =()=
___||__
______  \`.
      \`=='
       ||| data  
   `}
      <span className="text-pink-600 font-semibold">API</span>
      {` ||| on
       ||| tap`}
    </pre>
  )
}

function Card({ children }) {
  return <div className="bg-white shadow-md rounded-lg p-4">{children}</div>
}

export default function Pipeline() {
  return (
    <div className="p-12">
      <div className="max-w-4xl mx-auto flex justify-between items-center space-x-2">
        <Card>
          <div className="space-y-3 text-gray-700">
            <div className="text-lg font-medium text-center uppercase border-b">
              Fragmented Data
            </div>
            <div>
              <div className="font-medium">Charity Commission</div>
              {/* <ul className="ml-3 text-sm">
                  <li>BCP files</li>
                  <li>Web register</li>
                  <li>SOAP API</li>
                </ul> */}
            </div>
            <div>
              <div className="font-medium">Companies House</div>
            </div>
            <div>
              <div className="font-medium">360 Giving</div>
              {/* <ul className="ml-3 text-sm">
                  <li>GrantNav</li>
                </ul> */}
            </div>
            <div className="font-medium">Charity Websites</div>
            <div>
              <div className="font-medium">Royal Mail</div>
              {/* <ul className="ml-3 text-sm">
                  <li>Constituency</li>
                  <li>Local Authority</li>
                  <li>LSOA</li>
                  <li>County</li>
                </ul> */}
            </div>
            <div className="font-medium">Social Media</div>
          </div>
        </Card>
        <MergeSourcesHorizontal />
        <div className="flex space-x-1">
          <Card>
            <div className="flex flex-col items-center space-y-2">
              <div className="text-lg font-medium text-center border-b">
                CharityBase
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-12 h-12 text-gray-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                />
              </svg>
            </div>
          </Card>
          <div className="flex flex-col items-center">
            <APIPipeHorizontal />
            <div className="mx-8">
              <Card>
                <div className="text-lg font-medium text-center">YOU</div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
