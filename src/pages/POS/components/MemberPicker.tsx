import SearchableSelectInputStandard from '@/common/components/SearchableSelectInput/index-standard';
import { shortcutService } from '@/common/services/custom/shortcutService';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Button, InputRef, Modal, theme as antdTheme } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { getMember } from '../data/service';

type Props = {};

export default function MemberPicker({}: Props) {
  const { useToken } = antdTheme;
  const { token: theme } = useToken();
  const { member, setMember, changeVoucher } = useModel('POS.usePos');
  const [modalOpen, setModalOpen] = useState(false);

  const inputRef = useRef<InputRef>(null);
  // Function to focus on the input field
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    shortcutService.registerShortcut('F3', false, () => {
      setModalOpen(true);
      focusInput();
    });
    return () => {
      shortcutService.unregisterShortcut('F3', false); // Optionally unregister shortcuts
    };
  }, []);

  var hasMember = member != undefined;

  const handleButton = () => {
    if (hasMember) {
      setMember(undefined);
      changeVoucher(undefined);
    } else {
      setModalOpen(true);
    }
  };

  return (
    <>
      <div
        style={{
          display: 'inline-flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          border: '1px solid #d9d9d9',
          borderRadius: '6px',
          padding: '10px 20px',
          width: '100%',
          height: '68px',
          backgroundColor: hasMember ? theme.colorPrimary : undefined,
          color: hasMember ? 'white' : undefined,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            flexDirection: 'column',
          }}
        >
          <span>Pilih Anggota [F3]</span>
          <strong>
            {hasMember ? `${member?.member_no} - ${member?.name} - ${member?.type}` : 'NON ANGGOTA'}
          </strong>
        </div>
        <Button
          onClick={handleButton}
          type="text"
          style={{ color: hasMember ? 'white' : undefined }}
        >
          {hasMember ? <CloseOutlined /> : <PlusOutlined />}
        </Button>
      </div>
      <Modal
        open={modalOpen}
        title={'Pilih Anggota'}
        onCancel={() => setModalOpen(false)}
        footer={null}
      >
        <SearchableSelectInputStandard
          ref={inputRef}
          placeholder="Cari anggota (masukkan nomor / nama anggota)"
          onChange={(value: any, option: any) => {
            if (value) {
              var member = option.member;
              setMember(member);
              setModalOpen(false);
            }
          }}
          value={member?.id}
          style={{ width: '100%' }}
          fetchOptions={async (query) =>
            (await getMember(query)).data!.map((member: any) => {
              return {
                value: member.id,
                label: `${member.member_no} - ${member.name} - ${member.type}`,
                member,
              };
            })
          }
        />
      </Modal>
    </>
  );
}
