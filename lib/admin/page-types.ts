export type AdminSearchParams = Record<string, string | string[] | undefined>;

export type AdminListPageProps = {
  searchParams: Promise<AdminSearchParams>;
};

export type AdminDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<AdminSearchParams>;
};

export type AdminLayoutProps = {
  children: React.ReactNode;
};
