import DomainsTable from "@/components/domains";

export default function Domain() {
    return (
      <div className="p-6">
        <h1 className="text-3xl  text-center font-bold text-yellow-500 mb-4">Domains</h1>
        <DomainsTable domains={{
          main: 'NekoNode.net',
          mirrors: ['nekohub.net', 'nekohub.org', 'nekohub.co', 'nekohub.io'],
        }} />
      </div>
    );
  }
