import React, { useEffect, useState } from 'react';
import LoadingState from '../components/atoms/LoadingState';
import MemberListSection from '../components/organisms/MemberListSection';
import DefaultPageTemplate from '../components/templates/DefaultPageTemplate';
import { getMembers } from '../services/memberService';

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const data = await getMembers();
      setMembers(data);
    } catch (error) {
      console.error('Error fetching data:', error.message);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  if (loading) {
    return <LoadingState label="Memuat Silsilah Keluarga..." />;
  }

  return (
    <DefaultPageTemplate title="Daftar Anggota Keluarga" errorMessage={errorMessage}>
      <MemberListSection members={members} />
    </DefaultPageTemplate>
  );
}
