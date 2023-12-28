"use client";

export default function ListingView() {
  return (
    <div className="h-full">
      <ListingRow/>
      <ListingRow/>
      <ListingRow/>
      <ListingRow/>
    </div>
  )
}

const ListingRow = () => {
  return (
    <div className="p-1 border-b-2">
      <div className='flex justify-between'>
        <div className='flex'>
          <ActiveIndicator active={true}/>
          <p className="text-xl font-medium">Spring 2024 Rush Application</p>
        </div>
        <ApplicantCounter/>
      </div>
      <div>
        <p className="text-sm text-slate-400">Deadline: Aug-12-2024</p>
        <p className="text-sm text-slate-400">Created: Dec-25-2023</p>
      </div>
    </div>
  )
}

const ActiveIndicator = ({ active }: { active: boolean }) => {
  return (
    <div className="flex flex-row items-center">
      <span className={`flex w-3 h-3 rounded-full mr-2 ${active ? 'bg-green-500' : 'bg-red-500'}`}></span>
    </div>
  );
};


const ApplicantCounter = () => {
  return (
    <div className="bg-emerald-100 rounded">
      <p className="text-xl font-bold text-emerald-700 px-1">12</p>
    </div>
  )
}